import { buildGumroadAllAccessLink, getGumroadAllAccessUrl } from "@/lib/gumroad";

type AllAccessCtaProps = {
  surface: string;
  className?: string;
};

export function AllAccessCta({ surface, className = "" }: AllAccessCtaProps) {
  const allAccessUrl = getGumroadAllAccessUrl();

  if (!allAccessUrl) {
    return (
      <div
        className={`rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center ${className}`}
      >
        <p className="text-sm text-slate-400">
          All Access checkout opens soon.{" "}
          <a href="mailto:hello@novarho.com" className="text-brand-400 hover:text-brand-300">
            Email us
          </a>{" "}
          if you want early access.
        </p>
      </div>
    );
  }

  const href = buildGumroadAllAccessLink(allAccessUrl, surface);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${className}`}
    >
      Get All Access — €49
    </a>
  );
}
