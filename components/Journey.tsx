import type { SiteSettings } from "../src/generated/prisma-node/client";
import { paragraphs } from "./About";

interface Step {
  year: string;
  title: string;
  body: string;
}

function parseSteps(content: string): Step[] {
  return paragraphs(content).map((p) => {
    const m = p.match(/^(\d{4})\s*[—–-]?\s*(.*?)(?::|\.|$)/);
    if (!m) return { year: "", title: "", body: p };
    const remainder = p.slice(m[0].length).replace(/^:\s*/, "").trim();
    return { year: m[1], title: m[2], body: remainder };
  });
}

export default function Journey({ settings }: { settings: SiteSettings }) {
  const steps = parseSteps(settings.journeyContent);

  return (
    <section id="journey" data-scroll-pose="point" className="relative overflow-hidden bg-ink py-28 text-paper">
      <div className="pointer-events-none absolute inset-0 bg-grid-ink" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black text-paper">
          How I got here
        </h2>
        <p className="mt-3 max-w-xl font-body text-paper/70">
          A real sequence, so it earns the numbers. Lawn care runs deep in the family.
        </p>

        <ol className="mt-16 space-y-0">
          {steps.map((s, i) => (
            <li
              key={i}
              className="group relative grid gap-4 border-t-2 border-paper/10 py-10 sm:grid-cols-[120px_1fr] sm:gap-10"
            >
              <div className="flex items-baseline gap-4 sm:block">
                <span className="font-display text-6xl font-black leading-none text-court">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.year && (
                  <span className="mt-1 inline-block rounded-full bg-electric px-3 py-0.5 font-body text-xs font-bold text-ink">
                    {s.year}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-display text-2xl font-extrabold text-paper">{s.title}</h3>
                {s.body && <p className="mt-2 max-w-2xl font-body text-paper/75">{s.body}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}