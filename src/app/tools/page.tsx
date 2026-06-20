import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import {
  AFFILIATE_TOOLS,
  buildAffiliateUrl,
  TOOLS_PAGE_AFFILIATE_IDS,
} from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Tools we use — Automate This Week",
  description:
    "Affiliate links for tools we recommend when building agent-assisted automations.",
};

export default function ToolsPage() {
  const tools = AFFILIATE_TOOLS.filter((tool) => TOOLS_PAGE_AFFILIATE_IDS.includes(tool.id));

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          ← Automate This Week
        </Link>

        <header className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Tools we use</h1>
          <p className="mt-4 text-slate-400">
            When a playbook outgrows Zapier, we reach for agent-assisted builds. These are the
            tools we use — sign up through our links if you want to support the project.
          </p>
        </header>

        <ul className="mt-10 space-y-6">
          {tools.map((tool) => (
            <li
              key={tool.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <a
                href={buildAffiliateUrl(tool.id)}
                rel="sponsored noopener"
                target="_blank"
                className="text-xl font-bold text-brand-500 transition hover:text-brand-400"
              >
                {tool.name}
              </a>
              <p className="mt-2 text-slate-400">{tool.description}</p>
            </li>
          ))}
        </ul>

        <AffiliateDisclosure className="mt-10" />
      </div>
    </main>
  );
}
