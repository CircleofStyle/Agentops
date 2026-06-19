import { SignupForm } from "@/components/SignupForm";

type IssueEmailGateProps = {
  teaser: string;
  setupMinutes?: number;
};

export function IssueEmailGate({ teaser, setupMinutes }: IssueEmailGateProps) {
  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <p className="text-sm font-medium text-brand-500">Teaser · full playbook by email</p>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">{teaser}</p>
        {setupMinutes ? (
          <p className="mt-4 text-sm text-slate-500">
            Estimated setup time: {setupMinutes} minutes
          </p>
        ) : null}
        <p className="mt-6 text-slate-400">
          Verified subscribers receive the complete step-by-step workflow every Tuesday. The site
          keeps one free sample public — everything else is delivered by email.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white">Get the full playbook by email</h2>
        <p className="mt-2 text-slate-400">
          Same playbook we send the list — free, one per week, unsubscribe anytime.
        </p>
        <div className="mt-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
