"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Service = {
  eyebrow: string;
  title: string;
  intro: string;
  examples: string[];
  result: string;
  accent: string;
  mockup: "crm" | "pos" | "ads" | "ai";
};

const SERVICES: Service[] = [
  {
    eyebrow: "Home services · contractors · trades",
    title: "Turn more inquiries into booked jobs.",
    intro: "A polished website is only the front door. I can connect your forms, calls, estimates, scheduling, and follow-up so good leads do not disappear.",
    examples: ["Lead-capture website with service-area pages", "CRM pipeline for estimates, callbacks, and repeat work", "Google Ads landing pages that track calls and quote requests", "AI assistant that answers common questions after hours"],
    result: "Fewer missed leads. Faster follow-up. A clearer view of every job in motion.",
    accent: "electric",
    mockup: "crm",
  },
  {
    eyebrow: "Retail · restaurants · local shops",
    title: "Make every sale and repeat visit easier.",
    intro: "I can help connect your storefront, POS workflow, inventory, loyalty ideas, and marketing so the business feels organized behind the counter and online.",
    examples: ["POS-friendly menu, catalog, or product showcase", "Inventory and low-stock dashboards", "Digital loyalty cards and customer follow-up", "AI-powered product, menu, or ordering helper"],
    result: "Less manual work at the register. Better customer retention. More useful business data.",
    accent: "amber",
    mockup: "pos",
  },
  {
    eyebrow: "Professional services · clinics · offices",
    title: "Give clients a simpler path to yes.",
    intro: "For businesses built on trust, the experience before the appointment matters. I can make it easier to discover you, understand your offer, book, and stay informed.",
    examples: ["Service pages written around the questions clients actually ask", "Booking, intake, reminders, and secure client portals", "Google Business Profile and local search improvements", "AI knowledge base for staff and client FAQs"],
    result: "More qualified inquiries. Fewer repetitive questions. A calmer client experience.",
    accent: "grape",
    mockup: "ai",
  },
  {
    eyebrow: "Any local business",
    title: "Put the boring work on autopilot.",
    intro: "The best automation is not flashy—it quietly gives you time back. I can connect the tools you already use and add AI where it actually helps.",
    examples: ["Automatic lead replies and appointment reminders", "Review-request and reactivation campaigns", "Daily summaries of sales, leads, and open tasks", "Private AI assistant trained on your services and processes"],
    result: "More consistency without adding another full-time admin job.",
    accent: "paper",
    mockup: "ads",
  },
];

export default function JewellServices({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = el.querySelectorAll("[data-service-card]");
    gsap.fromTo(cards, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 78%" } });
    return () => gsap.killTweensOf(cards);
  }, []);

  const services = compact ? SERVICES.slice(0, 3) : SERVICES;

  return (
    <section id="services" ref={root} data-scroll-pose="point" className="relative z-10 py-36">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-electric/80">Built around the business</p>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[0.96] tracking-[-0.03em] text-paper">
              Tech that earns its keep<span className="text-amber">.</span>
            </h2>
          </div>
          {compact && <a href="/services" className="rounded-full border border-white/20 px-5 py-2.5 font-display text-sm font-bold text-paper transition-colors hover:border-electric hover:text-electric">See all business solutions</a>}
        </div>
        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/60">You do not need more software for its own sake. You need fewer dropped leads, less repeated work, and a clear way to grow. Here are a few ways I can help make that happen.</p>

        <div className="mt-14 flex items-center gap-4">
          <span className="h-px w-10 bg-electric/60" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">A few things I could put in your hands</p>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} data-service-card className="glass glass-sheen group overflow-hidden rounded-3xl">
              <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                <div className="p-7 sm:p-8">
                  <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-${service.accent}`}>{service.eyebrow}</p>
                  <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight text-paper">{service.title}</h3>
                  <p className="mt-4 font-body text-base leading-relaxed text-white/60">{service.intro}</p>
                  <ul className="mt-6 space-y-3">
                    {service.examples.map((example) => <li key={example} className="flex gap-3 font-body text-sm leading-relaxed text-white/75"><span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-${service.accent}`} />{example}</li>)}
                  </ul>
                </div>
                <Mockup type={service.mockup} accent={service.accent} />
              </div>
              <div className="border-t border-white/10 bg-white/[0.03] px-7 py-4 sm:px-8"><p className="font-body text-sm text-white/70"><span className={`font-bold text-${service.accent}`}>The payoff:</span> {service.result}</p></div>
            </article>
          ))}
        </div>
        {!compact && <div className="mt-12 flex flex-wrap items-center gap-5"><a href="#contact" className="rounded-full bg-electric px-6 py-3 font-display text-base font-extrabold text-void shadow-[0_0_24px_-6px_rgba(47,212,224,0.7)] transition-transform hover:-translate-y-0.5">Let&apos;s map out your business</a><span className="font-body text-sm text-white/45">No jargon. No pressure. Just practical ideas.</span></div>}
      </div>
    </section>
  );
}

function Mockup({ type, accent }: { type: Service["mockup"]; accent: string }) {
  const bar = `bg-${accent}`;
  if (type === "crm") return <div className="flex min-h-full items-center bg-ink/70 p-6"><div className="w-full rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-[10px] text-white/60 shadow-2xl"><div className="flex justify-between border-b border-white/10 pb-3"><span className="text-white/80">LEAD PIPELINE</span><span className={`text-${accent}`}>12 active</span></div>{["New inquiry", "Estimate sent", "Booked"].map((label, i) => <div key={label} className="mt-3 rounded-lg border border-white/10 p-3"><div className="flex justify-between"><span>{label}</span><span className={`text-${accent}`}>{[4, 3, 5][i]}</span></div><div className="mt-2 h-1 rounded-full bg-white/10"><div className={`h-full rounded-full ${bar}`} style={{ width: `${[42, 68, 84][i]}%` }} /></div></div>)}</div></div>;
  if (type === "pos") return <div className="flex min-h-full items-center bg-ink/70 p-6"><div className="grid w-full grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-[10px] text-white/60">{["Sales today", "Top item", "Repeat guests", "Low stock"].map((label, i) => <div key={label} className="rounded-lg border border-white/10 p-3"><div className={`text-xl font-bold text-${accent}`}>{["$2.4k", "Coffee", "38%", "04"][i]}</div><div className="mt-1 text-white/40">{label}</div></div>)}</div></div>;
  if (type === "ai") return <div className="flex min-h-full items-center bg-ink/70 p-6"><div className="w-full rounded-xl border border-white/10 bg-black/20 p-4 font-body text-xs text-white/65"><div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3"><span className={`h-2 w-2 rounded-full bg-${accent}`} /> Business knowledge assistant</div><div className="ml-auto max-w-[85%] rounded-lg bg-white/10 p-3">What should a new patient bring to their first appointment?</div><div className={`mt-3 max-w-[88%] rounded-lg border border-${accent}/30 bg-${accent}/10 p-3`}>I found the intake checklist and appointment details. Want me to send the link?</div></div></div>;
  return <div className="flex min-h-full items-center bg-ink/70 p-6"><div className="w-full rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-[10px] text-white/60"><div className="flex items-center justify-between"><span className="text-white/80">CAMPAIGN SNAPSHOT</span><span className={`text-${accent}`}>LIVE</span></div><div className="mt-5 flex items-end gap-2">{[32, 48, 44, 67, 74, 91, 82].map((height, i) => <div key={i} className={`flex-1 rounded-t bg-${accent}/70`} style={{ height: `${height}px` }} />)}</div><div className="mt-3 flex justify-between text-white/35"><span>Mon</span><span>Sun</span></div></div></div>;
}

export { SERVICES };
