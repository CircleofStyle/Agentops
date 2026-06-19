import { AFFILIATE_TOOLS, buildAffiliateUrl, getAffiliateToolsForIssue } from "@/lib/affiliates";

type AffiliateToolLinksProps = {
  issueSlug: string;
};

export function AffiliateToolLinks({ issueSlug }: AffiliateToolLinksProps) {
  const toolIds = getAffiliateToolsForIssue(issueSlug);
  const tools = AFFILIATE_TOOLS.filter((tool) => toolIds.includes(tool.id));

  return (
    <section
      aria-labelledby="affiliate-tools-heading"
      className="mt-12 rounded-xl border border-slate-800 bg-slate-900/40 p-6"
    >
      <h2 id="affiliate-tools-heading" className="text-lg font-semibold text-white">
        Tools for this playbook
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Sign up through these links to implement the workflow. Replacing a tool? The steps above
        still apply — swap the platform in the trigger and routing steps.
      </p>
      <ul className="mt-5 space-y-4">
        {tools.map((tool) => (
          <li key={tool.id} className="text-sm text-slate-300">
            <a
              href={buildAffiliateUrl(tool.id)}
              rel="sponsored noopener"
              target="_blank"
              className="font-medium text-brand-500 transition hover:text-brand-400"
            >
              {tool.name}
            </a>
            <span className="text-slate-500"> — {tool.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
