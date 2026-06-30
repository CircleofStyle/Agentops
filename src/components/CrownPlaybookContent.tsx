const CROWN_PLAYBOOK_SECTIONS = [
  {
    title: "Why scattered automations stall",
    body:
      "Twelve working Zaps is not the same as a business that runs without you babysitting every trigger. The gap shows up when follow-ups depend on memory, reviews slip between jobs, and nobody owns the weekly rhythm.",
  },
  {
    title: "What crown discipline means",
    body:
      "Crown discipline is a single AI CEO role that sets goals, delegates to specialist agents, and enforces a weekly operating rhythm — so your Season 1 playbooks run as one system, not scattered automations.",
  },
  {
    title: "The AI CEO job description",
    body:
      "Your AI CEO owns goal setting, task delegation, progress review, and escalation. Use this checklist each week: what shipped, what stalled, what to delegate next, and what to kill.",
  },
  {
    title: "Specialist agents to hire first",
    body:
      "Start with three generic roles: an Ops agent (follow-ups, scheduling, invoices), a Growth agent (reviews, referrals, content drafts), and a Builder agent (site tweaks, integrations, template fixes). Map each role to the Season 1 playbooks you already built.",
  },
  {
    title: "Your first delegation loop",
    body:
      "Pick one weekly goal → break it into agent tasks → review outcomes → adjust. Principles and templates first; tool screenshots optional at launch.",
  },
  {
    title: "The weekly discipline ritual",
    body:
      "Block 30 minutes for your CEO heartbeat: review open goals, assign new tasks, close loops, and retire automations that no longer earn their keep. Print this one-pager and run it every week.",
  },
  {
    title: "When to add agents vs. more Zaps",
    body:
      "Tactical fix → Zap. Recurring cross-functional work → specialist agent. Strategic direction → CEO session. Use this decision tree before adding complexity.",
  },
  {
    title: "Outcomes checklist",
    body:
      "Goals visible. Agents assigned. Weekly review scheduled. No orphaned automations. If you can check all four, crown discipline is installed.",
  },
] as const;

export function CrownPlaybookContent() {
  return (
    <section id="playbook" className="scroll-mt-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
        Crown Discipline Playbook
      </p>
      <h2 className="mt-3 text-2xl font-bold text-white">
        How to install an AI CEO that orchestrates specialist agents
      </h2>
      <p className="mt-4 text-slate-400">
        Vendor-neutral operating model — bring your own tools. No dev team required.
      </p>

      <ol className="mt-10 space-y-8">
        {CROWN_PLAYBOOK_SECTIONS.map((section, index) => (
          <li
            key={section.title}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Section {index + 1}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">{section.title}</h3>
            <p className="mt-3 text-slate-400">{section.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
