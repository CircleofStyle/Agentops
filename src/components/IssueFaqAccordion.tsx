import type { FaqItem } from "@/components/FaqSchema";

type IssueFaqAccordionProps = {
  items: FaqItem[];
  heading: string;
};

export function IssueFaqAccordion({ items, heading }: IssueFaqAccordionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="issue-faq-heading">
      <h2 id="issue-faq-heading" className="text-xl font-bold text-white">
        {heading}
      </h2>
      <div className="mt-4 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/40">
        {items.map(({ question, answer }) => (
          <details key={question} className="group px-4 py-1 sm:px-6">
            <summary className="cursor-pointer list-none py-4 text-sm font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {question}
                <span
                  className="mt-0.5 shrink-0 text-brand-500 transition group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-slate-400">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
