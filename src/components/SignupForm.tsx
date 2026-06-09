"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setMessage(data.message ?? "Check your inbox to confirm your subscription.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  if (state === "success") {
    return (
      <div
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-medium text-emerald-300">Almost there!</p>
        <p className="mt-2 text-slate-300">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          disabled={state === "loading"}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60"
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "signup-error" : undefined}
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "loading" ? "Subscribing…" : "Get the free brief"}
      </button>

      {state === "error" && (
        <p id="signup-error" className="text-sm text-red-400" role="alert">
          {message}
        </p>
      )}

      <p className="text-center text-xs text-slate-500">
        Free forever. Unsubscribe anytime. We send one playbook per week.
      </p>
    </form>
  );
}
