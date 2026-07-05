type IssueSeoPublicSummaryProps = {
  html: string;
};

export function IssueSeoPublicSummary({ html }: IssueSeoPublicSummaryProps) {
  return (
    <div
      className="issue-content mt-8 space-y-4 text-slate-300 [&_a]:font-medium [&_a]:text-brand-500 [&_a]:transition hover:[&_a]:text-brand-400 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_li]:ml-4 [&_li]:list-disc [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
