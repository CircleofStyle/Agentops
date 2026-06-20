const LEGAL_ENTITY =
  "Nova Rho, S.A. Krizevac, Luzernerstrasse 110, 6333 Hünenberg See";

const DATA_CATEGORIES = [
  "Contact details you provide when subscribing or asking for updates.",
  "Usage signals, IP addresses, device and browser metadata generated when you visit our site.",
  "Product delivery and support history when you interact via email or shared docs.",
  "Cookies and identifiers that help us keep the site running, offer analytics, or remember preferences.",
];

const LEGAL_BASES = [
  "Consent for marketing communications, newsletters, and analytics cookies.",
  "Performance of a contract when we send you the automation playbooks you signed up for.",
  "Legitimate interests for improving the site, preventing abuse, and ensuring availability.",
  "Compliance with legal obligations such as accounting, eDiscovery, or responding to lawful requests.",
];

const COOKIES = [
  {
    name: "Essential",
    purpose:
      "Keep the experience secure, balance load, and store UI preferences (e.g., dark mode).",
    retention: "Session or until you close the browser.",
  },
  {
    name: "Analytics",
    purpose: "Count visits, time on page, and funnels to improve the automation playbooks.",
    retention: "Up to 26 months depending on the vendor (Matomo / Plausible).",
  },
  {
    name: "Marketing & Automation",
    purpose: "Remember consent, personalize copy, and trigger the newsletter delivery.",
    retention: "Up to 12 months unless you opt-out earlier.",
  },
];

export default function LegalPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-500">Legal framework</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">NovaRho legal resources</h1>
          <p className="mx-auto max-w-3xl text-base text-slate-400 sm:text-lg">
            Every NovaRho website ships with transparent privacy, cookies, data protection, and
            Terms of Use statements that comply with EU GDPR and the Swiss Federal Act on Data
            Protection (FADP). This page collects the complete framework so regulators, customers,
            and partners can rely on a single reference.
          </p>
        </header>

        <section
          id="privacy-policy"
          className="space-y-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-xl shadow-brand-500/10"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Privacy policy</h2>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">GDPR + Swiss FADP</p>
          </div>
          <p className="text-slate-300">
            {LEGAL_ENTITY}, Switzerland, is the data controller for the
            Automate This Week site and playbook emails. We treat personal data
            with the protections demanded by Articles 5–8 of the EU General Data Protection
            Regulation and Articles 8–15 of the revised Swiss Federal Act on Data Protection.
          </p>
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 text-sm text-slate-300">
            <h3 className="text-base font-semibold text-white">Newsletter delivery</h3>
            <p className="mt-2">
              Automate This Week is primarily an email product. One sample playbook is published on
              the website so you can evaluate the format. Full playbooks are sent only to verified
              subscribers on a fixed sequence — one every 7 days after you confirm — at the email
              address you provide. Each playbook targets a measurable business outcome — response
              time, quote recovery, or reviews. You can unsubscribe from any email or by contacting{" "}
              <a className="text-brand-400 hover:text-brand-300" href="mailto:legal@novarho.com">
                legal@novarho.com
              </a>
              .
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5">
              <h3 className="text-lg font-semibold text-white">Data we collect</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                {DATA_CATEGORIES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5">
              <h3 className="text-lg font-semibold text-white">Legal bases</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                {LEGAL_BASES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5">
            <h3 className="text-lg font-semibold text-white">Your rights</h3>
            <p className="text-sm text-slate-300">
              Residents of the EU or Switzerland may request access, rectification, erasure,
              restriction of processing, data portability, or lodge a complaint with the Swiss FDPIC
              or their national data protection authority. Email{" "}
              <a className="text-brand-400 hover:text-brand-300" href="mailto:legal@novarho.com">
                legal@novarho.com
              </a>{" "}
              with your proof of identity and the right you are invoking. We reply within one month
              unless a complex request justifies a short extension under GDPR Article 12.
            </p>
          </div>
        </section>

        <section
          id="cookies"
          className="space-y-6 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/40"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Cookies and tracking</h2>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">ePrivacy + eIDAS</p>
          </div>
          <p className="text-slate-300">
            We lean on the EU ePrivacy Directive and Swiss regulations for consent. Consent is logged
            before we drop analytics or marketing cookies. You can revisit your cookie preferences at
            any time by clearing your consent cookie or blocking specific categories in your browser.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {COOKIES.map((cookie) => (
              <div
                key={cookie.name}
                className="flex flex-col gap-2 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5"
              >
                <h3 className="text-lg font-semibold text-white">{cookie.name}</h3>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Purpose</p>
                <p className="text-sm text-slate-300">{cookie.purpose}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Retention</p>
                <p className="text-sm text-slate-300">{cookie.retention}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400">
            To opt-out, adjust your browser or device settings to block third-party cookies, or delete
            cookies labeled “analytics,” “marketing,” or “preferences.” When cookies are blocked, the
            site still works but remembering your inbox preferences may not.
          </p>
        </section>

        <section
          id="data-protection"
          className="space-y-6 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-xl shadow-brand-500/10"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Data protection and transfers</h2>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Security first</p>
          </div>
          <p className="text-slate-300">
            We secure data with TLS in transit, encryption at rest, least-privilege storage, and
            monitoring that alerts us to unusual access. Access logs are kept for forensic purposes,
            and automated workflows notify/explore data-breach scenarios so we can comply with the
            72-hour disclosure obligation under GDPR.
          </p>
          <div className="grid gap-6 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 text-sm text-slate-300 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-white">Third-party processors</h3>
              <p>
                We work with trusted EU/Swiss partners such as Vercel (hosting), Postmark
                (emails), and Plausible (analytics). Each processor receives only the data it needs
                and is under a written processor agreement that mirrors GDPR Article 28 and Swiss
                requirements.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-white">International transfers</h3>
              <p>
                Data transfers outside Switzerland/EU rely on adequacy decisions (e.g., EU Commission,
                Swiss Federal Council) or standard contractual clauses supplemented by technical
                safeguards. No sensitive health or biometric data is exported without explicit
                consent.
              </p>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 text-sm text-slate-300">
            <h3 className="text-base font-semibold text-white">Retention</h3>
            <p>
              We keep data only as long as needed for the purposes above (typically 26 months for
              marketing and analytics, shorter for support requests). When the retention period ends,
              data is anonymized or deleted using approved routines.
            </p>
            <p>
              For urgent inquiries, reach our data protection officer at{" "}
              <a className="text-brand-400 hover:text-brand-300" href="mailto:legal@novarho.com">
                legal@novarho.com
              </a>
              .
            </p>
          </div>
        </section>

        <section
          id="terms-of-use"
          className="space-y-6 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/40"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Terms of use</h2>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Swiss & EU friendly</p>
          </div>
          <p className="text-slate-300">
            By using Automate This Week, you agree that NovaRho provides automation playbooks and
            marketing materials “as-is.” We do not guarantee specific business outcomes, uptime, or
            accuracy. Software and automations are your responsibility to test before deployment.
            Full playbooks are delivered by email to verified subscribers; one sample may remain
            publicly readable on the website.
          </p>
          <ul className="list-disc space-y-3 pl-5 text-sm text-slate-300">
            <li>Use the site only for lawful, non-deceptive purposes.</li>
            <li>
              Respect intellectual property; do not redistribute email playbooks or forward them
              beyond your organization without permission.
            </li>
            <li>
              We may suspend or terminate access if we detect abuse, spam, or attempts to reverse
              engineer our infrastructure.
            </li>
            <li>
              Updates to these terms will be posted here with a clear “Last updated” date. Continued
              use after updates indicates acceptance.
            </li>
          </ul>
          <p className="text-sm text-slate-400">
            Swiss law governs disputes that cannot be resolved informally. The competent courts in
            Zug have exclusive jurisdiction, unless mandatory consumer protections dictate
            otherwise for EU residents.
          </p>
        </section>

        <footer className="space-y-2 border-t border-slate-800/60 pt-6 text-center text-sm text-slate-500">
          <p>{LEGAL_ENTITY} · Switzerland</p>
          <p>
            Questions? Email{" "}
            <a className="text-brand-400 hover:text-brand-300" href="mailto:legal@novarho.com">
              legal@novarho.com
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
