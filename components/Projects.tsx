"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { PortfolioItem } from "@prisma/client";
import { CATEGORY_STYLE } from "./HeroCarousel";

const FILTERS = [
  { key: "all", label: "All work" },
  { key: "client", label: "Client sites" },
  { key: "homelab", label: "Homelab" },
  { key: "experiment", label: "Experiments" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function Projects({ items }: { items: PortfolioItem[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useLocalState<FilterKey>("all");

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
    <section id="projects" data-scroll-pose="point" className="relative overflow-hidden bg-ink py-28 text-paper">
      <div className="pointer-events-none absolute inset-0 bg-grid-ink" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-lg font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black text-paper">
            Ships I&apos;ve launched
          </h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`rounded-full px-4 py-2 font-body text-sm font-bold transition-colors ${
                  filter === f.key
                    ? "bg-court text-ink"
                    : "border-2 border-paper/25 text-paper/70 hover:border-electric hover:text-electric"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={grid} className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <article
              key={item.id}
              data-card
              className="group flex flex-col rounded-2xl border-2 border-paper/15 bg-paper p-6 text-left transition-colors hover:border-electric"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 font-body text-[11px] font-bold uppercase tracking-widest ${
                    CATEGORY_STYLE[item.category] ?? "bg-ink text-paper"
                  }`}
                >
                  {item.category}
                </span>
                <span className="font-display text-xl font-black text-grape transition-transform group-hover:rotate-12">✦</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold text-ink">{item.title}</h3>
              <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-ink/75">{item.description}</p>
              {item.techTags && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.techTags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="font-mono text-[11px] text-slatey">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-fit items-center gap-1 font-body text-sm font-bold text-court-deep hover:underline"
                >
                  Visit live site →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// tiny hook to avoid pulling in a state lib
import { useState } from "react";
function useLocalState<T>(initial: T): [T, (v: T) => void] {
  const [s, setS] = useState<T>(initial);
  return [s, setS];
}