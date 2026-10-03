"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    number: "01",
    title: "I know what it means to own the outcome.",
    copy: "Before I built websites, I ran a real service business for more than a decade. I learned to scope the job, communicate clearly, show up, and stand behind the result.",
    accent: "text-electric",
  },
  {
    number: "02",
    title: "You work with the builder, not a ticket queue.",
    copy: "There is no handoff maze between you and the person doing the work. You get direct answers, practical advice, and someone who understands your project from the first conversation through launch.",
    accent: "text-amber",
  },
  {
    number: "03",
    title: "The tech is built for real life.",
    copy: "I care about the parts people actually feel: a site that loads, a workflow that saves time, hosting that stays maintained, and tools that make sense for the business using them.",
    accent: "text-paper",
  },
];

export default function JewellWhy() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = el.querySelectorAll("[data-why-card]");
    gsap.fromTo(cards, { opacity: 0, y: 28 }, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 72%" },
    });
    return () => gsap.killTweensOf(cards);
  }, []);

  return (
    <section id="about" ref={root} data-scroll-pose="point" className="relative z-10 border-y border-white/10 py-36">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-amber/90">The person behind the stack</p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[0.96] tracking-[-0.03em] text-paper">
              Practical tech. <span className="text-electric">Personal ownership.</span>
            </h2>
            <p className="mt-7 max-w-lg font-body text-lg leading-relaxed text-white/70">
              I&apos;m JJ Jewell. I spent ten years running Jewellz Lawn Service before moving into websites, infrastructure, and self-hosted AI. That background shapes how I work: listen first, solve the actual problem, and leave things better than I found them.
            </p>
            <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-white/50">
              If you want an agency to disappear behind a process, I&apos;m probably not your guy. If you want a thoughtful partner who can explain the tech and take responsibility for the result, we should talk.
            </p>
            <a href="#contact" className="mt-8 inline-flex rounded-full bg-amber px-6 py-3 font-display text-base font-extrabold text-void shadow-[0_0_24px_-8px_rgba(255,180,84,0.8)] transition-transform hover:-translate-y-0.5">
              Talk through your project
            </a>
          </div>

          <div className="grid gap-4">
            {REASONS.map((reason) => (
              <article key={reason.number} data-why-card className="glass glass-sheen group rounded-2xl p-6 sm:p-7">
                <div className="flex gap-5">
                  <span className={`pt-1 font-mono text-xs font-bold tracking-[0.2em] ${reason.accent}`}>{reason.number}</span>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold leading-tight text-paper transition-colors group-hover:text-electric">{reason.title}</h3>
                    <p className="mt-3 font-body text-base leading-relaxed text-white/60">{reason.copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
