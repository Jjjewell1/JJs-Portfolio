import type { PortfolioItem } from "@prisma/client";
import HeroCarousel from "./HeroCarousel";

export function Ticker({ chips }: { chips?: string[] }) {
  const items = (chips?.length ? chips : ["JEWELLCORE", "WEB", "HOSTING", "HOMELAB", "AI", "SELF-HOSTED", "BUILT DIFFERENT"]).map((c) => c.toUpperCase());
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-4 border-ink bg-court py-2" aria-hidden="true">
      <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-8">
            {row.map((c, idx) => (
              <span key={`${dup}-${idx}`} className="flex items-center gap-8 font-display text-sm font-extrabold tracking-tight text-ink">
                {c} <span className="text-ink/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ items }: { items: PortfolioItem[] }) {
  return (
    <section id="hero" data-scroll-pose="wave" className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 bg-grid-ink" aria-hidden="true" />
      {/* floating asterisks */}
      <span aria-hidden="true" className="pointer-events-none absolute left-[6%] top-[18%] font-display text-5xl font-black text-court opacity-70">¤</span>
      <span aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[10%] font-display text-4xl font-black text-electric opacity-60">✦</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[22%] left-[12%] font-display text-3xl font-black text-grape opacity-60">✧</span>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-5 py-24 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex-1">
          <h1 className="max-w-xl font-display text-[clamp(2.6rem,6vw,4.6rem)] font-black leading-[0.98] text-paper">
            Real sites.
            <br />
            <span className="text-court">Real homelab.</span>
            <br />
            Zero middlemen.
          </h1>
          <p className="mt-6 max-w-md font-body text-lg text-paper/80">
            I&apos;m <strong className="text-electric">JJ Jewell</strong> — ten years running my own lawn-care
            business, now running my own servers, websites, and AI for small businesses and family. Built by hand.
            Hosted at home. Maintained for real.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-full bg-court px-6 py-3 font-display text-base font-extrabold text-ink shadow-chunky transition-transform hover:-translate-y-0.5"
            >
              See the work ↓
            </a>
            <a
              href="#contact"
              className="rounded-full border-2 border-paper/25 px-6 py-3 font-display text-base font-extrabold text-paper transition-colors hover:border-electric hover:text-electric"
            >
              Say hi
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end" data-scroll-pose="wave">
          <HeroCarousel items={items} />
        </div>
      </div>
    </section>
  );
}