"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function JewellHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = el.querySelectorAll("[data-reveal]");

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      items,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", delay: 0.15 }
    );

    const floaters = Array.from(el.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (floaters.length === 0) return () => gsap.killTweensOf(items);

    const per = floaters.map((f) => ({ f, depth: Number(f.dataset.parallax || 12) }));
    const xTo = gsap.quickTo(floaters, "x", { duration: 0.6, ease: "power2.out" });
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      el.style.setProperty("--hero-x", `${e.clientX}px`);
      el.style.setProperty("--hero-y", `${e.clientY}px`);
      per.forEach(({ f, depth }, i) => {
        xTo(nx * depth * (i % 2 === 0 ? 1 : -1));
        gsap.to(f, { y: -ny * depth * 0.4, duration: 0.6, ease: "power2.out", overwrite: "auto" });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf([items, floaters]);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      data-scroll-pose="wave"
      className="relative z-10 flex min-h-screen items-center overflow-hidden"
    >
      {/* faint grid that fades in behind the HUD */}
      <div aria-hidden="true" data-jj-grid className="pointer-events-none absolute inset-0 bg-grid-void opacity-80 [mask-image:radial-gradient(70%_70%_at_50%_40%,black,transparent)]" />

      {/* A soft, cursor-led light field gives the hero the same alive, infinite-canvas feel as Onlook. */}
      <div aria-hidden="true" className="hero-light pointer-events-none absolute inset-0" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
        <div data-parallax="18" className="hero-panel hero-panel-one glass-deep absolute right-[7%] top-[16%] w-72 rotate-[6deg] rounded-2xl p-4">
          <div className="mb-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-white/40"><span>live / home-server</span><span className="text-electric">● online</span></div>
          <div className="space-y-2 font-mono text-[11px] text-white/65"><div><span className="text-electric">01</span> const <span className="text-amber">site</span> = await build()</div><div><span className="text-electric">02</span> deploy --self-hosted</div><div><span className="text-electric">03</span> uptime: <span className="text-electric">99.98%</span></div></div>
          <div className="mt-5 h-16 rounded-lg bg-[linear-gradient(135deg,rgba(47,212,224,.22),rgba(124,92,252,.18))] p-3"><div className="h-full rounded border border-white/10 bg-black/10"><div className="mt-4 ml-3 h-1.5 w-20 rounded-full bg-electric/60" /></div></div>
        </div>
        <div data-parallax="25" className="hero-panel glass-deep absolute bottom-[16%] right-[22%] w-56 -rotate-[7deg] rounded-2xl p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/50"><span className="h-2 w-2 rounded-full bg-amber shadow-[0_0_12px_var(--amber)]" /> NODE 01 / HOME</div>
          <div className="mt-4 font-display text-2xl font-black text-paper">Made with intent.</div>
          <div className="mt-2 font-mono text-[10px] text-white/40">No hand-offs. No black boxes.</div>
        </div>
      </div>

      {/* left-weighted scrim so copy stays legible over the bright 3D core */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background:linear-gradient(100deg,rgba(2,3,8,0.92)_0%,rgba(2,3,8,0.6)_28%,rgba(2,3,8,0.12)_52%,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-28 lg:py-0">
        <div className="max-w-2xl">
          <div data-reveal className="glass flex w-fit items-center gap-2 rounded-full px-4 py-1.5">
            <span aria-hidden="true" className="inline-block h-2 w-2 animate-pulse rounded-full bg-electric" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.28em] text-white/70">
              OPERATIVE · JEWELLCORE · SELF-HOSTED
            </span>
          </div>

          <h1 className="mt-7 font-display text-[clamp(2.9rem,8vw,6.4rem)] font-black leading-[0.92] tracking-[-0.03em] text-paper">
            <span data-reveal className="block">Real sites.</span>
            <span data-reveal className="block text-electric text-glow-cyan">Real homelab.</span>
            <span data-reveal className="block">
              Zero <span className="text-amber text-glow-amber">middlemen.</span>
            </span>
          </h1>

          <p data-reveal className="mt-7 max-w-md font-body text-lg text-white/80 [text-shadow:0_1px_20px_rgba(2,3,8,0.9)]">
            I&apos;m <strong className="font-bold text-paper">JJ Jewell</strong> — built by hand, hosted at home,
            maintained for real. A decade running my own business, now running my own servers, sites, and AI.
          </p>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#ships"
              className="rounded-full bg-electric px-7 py-3.5 font-display text-base font-extrabold text-void shadow-[0_0_24px_-6px_rgba(47,212,224,0.7)] transition-transform hover:-translate-y-0.5"
            >
              See the work ↓
            </a>
            <a
              href="#contact"
              className="glass rounded-full border-white/20 px-7 py-3.5 font-display text-base font-extrabold text-paper transition-colors hover:border-electric hover:text-electric"
            >
              Say hi
            </a>
          </div>

          {/* floating status chips */}
          <div data-reveal className="mt-12 flex flex-wrap gap-3 font-mono text-[11px] tracking-widest">
            {[
              ["UPTIME", "SELF-HOSTED"],
              ["STACK", "THREE.JS / NEXT.JS"],
              ["BUILT BY", "HAND. OBSESSIVELY."],
            ].map(([k, v]) => (
              <span key={k} className="glass rounded-lg px-3 py-2 text-white/60">
                <span className="text-electric">{k}</span>
                <span className="mx-2 text-white/20">·</span>
                <span className="text-white/80">{v}</span>
              </span>
            ))}
          </div>
        </div>

        {/* floating corner accents */}
        <span
          aria-hidden="true"
          data-parallax="16"
          className="pointer-events-none absolute left-[8%] top-[16%] hidden font-mono text-xs text-electric/60 md:block"
        >
          ◈ ◈ ◈
        </span>
        <span
          aria-hidden="true"
          data-parallax="26"
          className="pointer-events-none absolute bottom-[18%] right-[7%] hidden font-mono text-[11px] text-amber/50 lg:block"
        >
          node.01 {`<-`} home
        </span>
        <span
          aria-hidden="true"
          data-parallax="20"
          className="pointer-events-none absolute right-[26%] top-[24%] hidden font-mono text-[11px] text-white/25 md:block"
        >
          °{`>`} status: nominal
        </span>
      </div>
    </section>
  );
}
