"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { PortfolioItem } from "../src/generated/prisma-node/client";

const FILTERS = [
  { key: "all", label: "All work" },
  { key: "client", label: "Client sites" },
  { key: "homelab", label: "Homelab" },
  { key: "experiment", label: "Experiments" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const COVER_STYLE: Record<string, string> = {
  client: "from-electric/80 via-cyan-400/20 to-ink",
  homelab: "from-amber/80 via-orange-500/20 to-ink",
  experiment: "from-grape/80 via-fuchsia-500/20 to-ink",
};

export default function JewellShips({ items }: { items: PortfolioItem[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !grid.current) return;
    const cards = grid.current.querySelectorAll("[data-card]");
    gsap.fromTo(
      cards,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out", overwrite: true }
    );
  }, [filter]);

  const visible = items.filter((i) => filter === "all" || i.category === filter);

  return (
    <section id="ships" data-scroll-pose="point" className="relative z-10 py-40">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-electric/80">
              Selected work / 2021—now
            </p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black tracking-[-0.02em] text-paper">
              Ships I&apos;ve launched<span className="text-amber">.</span>
            </h2>
            <p className="mt-3 max-w-md font-body text-white/55">
              Real deployments, pulled straight from the live list — what ships, stays shipped.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`rounded-full px-4 py-2 font-body text-sm font-bold transition-colors ${
                  filter === f.key
                    ? "bg-electric text-void"
                    : "glass border-white/15 text-white/60 hover:border-electric hover:text-electric"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={grid} className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item, i) => (
            <article
              key={item.id}
              data-card
              className={`glass glass-sheen group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:shadow-[0_22px_60px_-28px_rgba(47,212,224,0.7)] ${
                i === 0 ? "md:col-span-2 xl:col-span-2" : ""
              }`}
            >
              <div className={`relative min-h-40 overflow-hidden border-b border-white/10 bg-gradient-to-br ${COVER_STYLE[item.category] ?? "from-paper/40 to-ink"} ${i === 0 ? "md:min-h-56" : ""}`}>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0_45%,rgba(255,255,255,.16)_45%_46%,transparent_46%_100%)] opacity-70" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-transparent" />
                <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white/75">
                    {String(i + 1).padStart(2, "0")} / {item.category}
                  </span>
                  <span aria-hidden="true" className="font-display text-4xl font-black text-white/70 transition-transform group-hover:rotate-12 group-hover:scale-110">✦</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className={`font-display font-extrabold text-paper ${i === 0 ? "text-3xl" : "text-2xl"}`}>{item.title}</h3>
                <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-white/60">{item.description}</p>

                {item.techTags && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {item.techTags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                      <span key={t} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/50">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {item.liveUrl && (
                  <a href={item.liveUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-fit rounded-full border border-electric/40 px-4 py-2 font-body text-sm font-bold text-electric transition-colors hover:bg-electric hover:text-void">
                    Open project
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
