"use client";

import Link from "next/link";

import { SignupForm } from "@/components/SignupForm";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedPath } from "@/i18n/navigation";
import { isAllAccessCommerceVisible } from "@/lib/commerce-visibility";

type IssueEmailGateProps = {
  teaser: string;
  setupMinutes?: number;
};

export function IssueEmailGate({ teaser, setupMinutes }: IssueEmailGateProps) {
  const { locale, dict } = useI18n();
  const t = dict.issueGate;
  const showAllAccessCommerce = isAllAccessCommerceVisible();

  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <p className="text-sm font-medium text-brand-500">{t.teaserLabel}</p>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">{teaser}</p>
        {setupMinutes ? (
          <p className="mt-4 text-sm text-slate-500">
            {t.setupTime} {setupMinutes} {dict.common.min}
          </p>
        ) : null}
        <p className="mt-6 text-slate-400">{t.body}</p>
        {showAllAccessCommerce ? (
          <p className="mt-4 text-sm text-slate-500">
            {t.cantWait}{" "}
            <Link
              href={localizedPath("/all-access", locale)}
              className="font-medium text-brand-500 transition hover:text-brand-400"
            >
              {dict.common.getAllAccess}
            </Link>{" "}
            {dict.signup.allAccessImmediate}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
        <p className="mt-2 text-slate-400">{t.subtitle}</p>
        <div className="mt-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
