"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { PortfolioItem } from "@prisma/client";

interface Pos {
  x: number;
  y: number;
  scale: number;
  rot: number;
  opacity: number;
  z: number;
}

function posFor(i: number, total: number): Pos {
  void total;
  const x = -Math.min(38 * i, 140);
  const y = 10 * i;
  const scale = Math.max(1 - 0.12 * i, 0.6);
  const rot = i % 2 === 0 ? -5 - i * 1.6 : 5 + i * 1.6;
  const opacity = Math.max(1 - 0.15 * i, 0.35);
  return { x, y, scale, rot, opacity, z: 60 - i * 10 };
}

const CATEGORY_STYLE: Record<string, string> = {
  client: "bg-court text-ink",
  homelab: "bg-electric text-ink",
  experiment: "bg-grape text-paper",
};

export default function HeroCarousel({ items }: { items: PortfolioItem[] }) {
  const [order, setOrder] = useState<string[]>(() => items.map((i) => i.id));
  const els = useRef<Record<string, HTMLButtonElement | null>>({});
  const positions = useRef<Record<string, Pos>>({});
  const reduced = useRef(false);
  const firstRun = useRef(true);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {

    if (reduced.current) return; // static inline styles carry the layout

    const targets = items.filter((it) => order.includes(it.id));
    const tl = gsap.timeline();
    targets.forEach((it, i) => {
      const el = els.current[it.id];
      if (!el) return;
      const to = posFor(i, targets.length);
      const from = firstRun.current
        ? { x: 40 + i * 20, y: -30 - i * 8, scale: to.scale + 0.02, rot: to.rot - 4, opacity: to.opacity + 0.15, z: to.z + 5 }
        : positions.current[it.id] ?? to;
      positions.current[it.id] = to;
      const isFront = i === 0;
      tl.fromTo(
        el,
        { x: from.x, y: from.y, scale: from.scale, rotation: from.rot, opacity: from.opacity, zIndex: from.z },
        {
          x: to.x,
          y: to.y,
          scale: to.scale,
          rotation: to.rot,
          opacity: to.opacity,
          zIndex: to.z,
          duration: isFront ? 0.85 : 0.7,
          ease: isFront ? "back.out(1.4)" : "power3.out",
        },
        i === 0 ? 0 : i * 0.03
      );
    });
    firstRun.current = false;
  }, [order, items]);

  const bringToFront = (clickedId: string) => {
    if (clickedId === order[0]) return;
    setOrder((cur) => [clickedId, ...cur.filter((id) => id !== clickedId)]);
  };

  const shift = (dir: 1 | -1) => {
    setOrder((cur) => {
      const next = [...cur];
      if (dir === 1) next.push(next.shift()!); // next: second card becomes front
      else next.unshift(next.pop()!);          // prev: last card becomes front
      return next;
    });
  };

  const itemsByOrder = useMemo(
    () => order.map((id) => items.find((i) => i.id === id)!).filter(Boolean),
    [order, items]
  );

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        className="relative"
        style={{ height: "clamp(430px, 58vh, 560px)", width: "min(400px, 84vw)" }}
        role="group"
        aria-label="Featured projects carousel"
      >
        {itemsByOrder.map((it, i) => {
          const p = posFor(i, itemsByOrder.length);
          const isFront = i === 0;
          return (
            <button
              key={it.id}
              ref={(el) => {
                els.current[it.id] = el;
              }}
              tabIndex={isFront ? 0 : -1}
              onClick={() => bringToFront(it.id)}
              aria-label={`${it.title}${isFront ? " (active)" : ", tap to bring to front"}`}
              className={`absolute inset-0 m-auto block origin-center rounded-2xl transition-shadow ${
                isFront ? "cursor-default" : "cursor-pointer hover:brightness-110"
              }`}
              style={{
                width: "min(400px, 84vw)",
                height: "min(520px, 62vh)",
                opacity: p.opacity,
                zIndex: isFront ? 60 : p.z,
                transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rot}deg)`,
              }}
            >
              <CardView item={it} front={isFront} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => shift(-1)}
          aria-label="Previous project"
          className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink shadow-chunky transition-transform hover:-translate-y-0.5"
        >
          ←
        </button>
        <div className="px-2 font-display text-sm font-extrabold tracking-tight text-paper/70">
          {order.length > 0 ? items.findIndex((it) => it.id === order[0]) + 1 : 0} / {items.length}
        </div>
        <button
          onClick={() => shift(1)}
          aria-label="Next project"
          className="grid h-11 w-11 place-items-center rounded-full bg-court text-ink shadow-chunky transition-transform hover:-translate-y-0.5"
        >
          →
        </button>
      </div>
    </div>
  );
}

function CardView({ item, front }: { item: PortfolioItem; front: boolean }) {
  const cover = item.imageUrl;
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl text-left shadow-2xl ${
        front ? "outline outline-2 outline-electric/60" : ""
      }`}
      style={{ background: "var(--paper)" }}
    >
      {/* art area */}
      <div className="relative flex-1 overflow-hidden" style={{ background: "var(--ink)" }}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-grid-ink p-5">
            <div className="flex items-start justify-between">
              <span
                className={`rounded-full px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest ${
                  CATEGORY_STYLE[item.category] ?? "bg-paper text-ink"
                }`}
              >
                {item.category}
              </span>
              <span className="font-display text-2xl font-black text-court">✦</span>
            </div>
            {/* vinyl disc */}
            <div className="relative mx-auto my-4 h-40 w-40">
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #232a4a, #14172b 70%)" }} />
              <div className="absolute inset-4 rounded-full border border-paper/15" />
              <div className="absolute inset-9 rounded-full border border-paper/20" />
              <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center" style={{ background: "var(--court-orange)" }}>
                <span className="font-display text-lg font-black text-ink">{item.title.charAt(0)}</span>
              </div>
            </div>
            <div className="font-mono text-[10px] tracking-widest text-paper/40">JEWELLCORE · SIDE A</div>
          </div>
        )}
      </div>

      {/* info strip */}
      <div className="flex flex-col gap-1 border-t-4 p-4" style={{ borderColor: "var(--court-orange)" }}>
        <h3 className="font-display text-xl font-extrabold leading-tight text-ink">{item.title}</h3>
        {front ? (
          <p className="line-clamp-2 font-body text-sm text-slatey">{item.description}</p>
        ) : (
          <p className="font-body text-xs text-slatey/80">{item.category}</p>
        )}
        {front && item.liveUrl && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 inline-flex w-fit items-center gap-1 font-body text-sm font-bold text-court-deep hover:underline"
          >
            Visit live site →
          </a>
        )}
      </div>
    </div>
  );
}

export { CATEGORY_STYLE };