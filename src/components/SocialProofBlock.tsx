import { getPublicSiteStats } from "@/lib/public-stats";

export async function SocialProofBlock() {
  const stats = await getPublicSiteStats();
  const { confirmedSubscribers, publishedWorkflows } = stats;

  return (
    <section
      className="mx-auto mt-12 max-w-xl rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-6 text-center"
      aria-live="polite"
    >
      <h2 className="text-base font-semibold text-slate-200">
        Join service businesses putting playbooks to work
      </h2>

      {confirmedSubscribers === 0 ? (
        <p className="mt-3 text-sm text-slate-400">
          Be among the first service businesses to deploy playbook #1
        </p>
      ) : (
        <p className="mt-3 text-sm text-slate-400">
          <span className="font-medium text-slate-200">
            {confirmedSubscribers.toLocaleString()}+ verified subscribers
          </span>
        </p>
      )}

      {publishedWorkflows > 0 ? (
        <p className="mt-2 text-sm text-slate-500">
          {publishedWorkflows} step-by-step playbook{publishedWorkflows === 1 ? "" : "s"} ready to
          deploy
        </p>
      ) : null}
    </section>
  );
}
