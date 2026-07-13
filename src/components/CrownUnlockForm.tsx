"use client";

import { useState } from "react";
import Link from "next/link";

import { useI18n } from "@/i18n/I18nProvider";
import { localizedPath } from "@/i18n/navigation";

export function CrownUnlockForm() {
  const { locale, dict } = useI18n();
  const t = dict.crown;
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/crown/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...(code.trim() ? { code: code.trim() } : {}),
        }),
      });

      const data = (await response.json()) as { error?: string; redirect?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? t.unlockFailed);
        return;
      }

      window.location.href = data.redirect ?? localizedPath("/crown", locale);
    } catch {
      setStatus("error");
      setMessage(t.unlockNetworkError);
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-white">{t.unlockTitle}</h2>
      <p className="mt-2 text-slate-400">{t.unlockBody}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="crown-email" className="block text-sm font-medium text-slate-300">
            {t.unlockEmailLabel}
          </label>
          <input
            id="crown-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder={t.unlockEmailPlaceholder}
          />
        </div>

        <div>
          <label htmlFor="crown-code" className="block text-sm font-medium text-slate-300">
            {t.unlockCodeLabel}{" "}
            <span className="font-normal text-slate-500">{t.unlockCodeOptional}</span>
          </label>
          <input
            id="crown-code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder={t.unlockCodePlaceholder}
          />
        </div>

        {message ? <p className="text-sm text-red-400">{message}</p> : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? t.unlockSubmitting : t.unlockSubmit}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        {t.unlockNeedPlaybooks}{" "}
        <Link
          href={localizedPath("/all-access", locale)}
          className="text-brand-500 transition hover:text-brand-400"
        >
          {t.unlockNeedPlaybooksLink}
        </Link>
      </p>
    </div>
  );
}
