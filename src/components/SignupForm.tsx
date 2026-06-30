"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  parseUtmFromSearchParams,
  UTM_PARAM_KEYS,
  UTM_STORAGE_KEY,
  type UtmParams,
} from "@/lib/utm";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedPath } from "@/i18n/navigation";

type FormState = "idle" | "loading" | "success" | "error";

function readStoredUtm(): UtmParams {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}

export function SignupForm() {
  const { locale, dict } = useI18n();
  const t = dict.signup;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [utm, setUtm] = useState<UtmParams>({});

  useEffect(() => {
    const fromUrl = parseUtmFromSearchParams(new URLSearchParams(window.location.search));
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
      setUtm(fromUrl);
      return;
    }

    setUtm(readStoredUtm());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const payload: Record<string, string> = { email, preferredLocale: locale };
      for (const key of UTM_PARAM_KEYS) {
        const value = utm[key];
        if (value) payload[key] = value;
      }

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? t.errorDefault);
        return;
      }

      setState("success");
      setMessage(data.message ?? t.successDefault);
      setEmail("");
    } catch {
      setState("error");
      setMessage(t.networkError);
    }
  }

  if (state === "success") {
    return (
      <div
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-medium text-emerald-300">{t.successTitle}</p>
        <p className="mt-2 text-slate-300">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="sr-only">
          {t.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
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
        {state === "loading" ? t.submitting : t.submit}
      </button>

      {state === "error" && (
        <p id="signup-error" className="text-sm text-red-400" role="alert">
          {message}
        </p>
      )}

      <p className="text-center text-xs text-slate-500">
        {t.footnote}{" "}
        <Link
          href={localizedPath("/season-1", locale)}
          className="text-brand-400 hover:text-brand-300"
        >
          {dict.common.seeSeason1}
        </Link>
        .
      </p>
      <p className="text-center text-xs text-slate-500">
        {t.cantWait}{" "}
        <Link
          href={localizedPath("/all-access", locale)}
          className="font-medium text-brand-400 hover:text-brand-300"
        >
          {dict.common.getAllAccess}
        </Link>{" "}
        {t.allAccessImmediate}
      </p>
    </form>
  );
}
