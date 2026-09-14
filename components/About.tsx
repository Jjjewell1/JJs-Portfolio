import type { SiteSettings } from "../src/generated/prisma-node/client";

const STATS = [
  { n: "10+", label: "years running a real business" },
  { n: "1", label: "homelab, fully self-hosted" },
  { n: "100%", label: "hand-built, hand-maintained" },
];

export function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function About({ settings }: { settings: SiteSettings }) {
  const copy = paragraphs(settings.aboutContent).join("\n\n") || settings.aboutContent;
  const blocks = copy.split("\n\n").filter(Boolean);

  return (
    <section id="about" data-scroll-pose="point" className="relative bg-paper py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-light" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black text-ink">
              I ran a real business first. The tech is just newer tools.
            </h2>
            <div className="mt-8 space-y-5">
              {blocks.map((p, idx) => (
                <p key={idx} className="font-body text-[1.05rem] leading-relaxed text-ink/85">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-5 border-b-2 border-ink/15 pb-5 [&:nth-child(2)>div>span:first-child]:text-electric [&:nth-child(3)>div>span:first-child]:text-grape"
              >
                <span className="w-24 font-display text-5xl font-black leading-none text-court">{s.n}</span>
                <span className="font-body text-base font-medium text-ink/75">{s.label}</span>
              </div>
            ))}
            <div className="mt-6 rounded-2xl p-6 text-ink shadow-chunky" style={{ background: "var(--electric-cyan)" }}>
              <p className="font-display text-lg font-extrabold leading-snug">
                The whole pitch: &ldquo;I built and ran a real business, then rebuilt those instincts into software.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}