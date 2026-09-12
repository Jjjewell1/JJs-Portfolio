"use client";

import Hopper from "./Hopper";

export default function ChatSection() {
  const open = () => window.dispatchEvent(new CustomEvent("chat:open"));

  return (
    <section id="chat" data-scroll-pose="talking" className="relative overflow-hidden bg-electric py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <div className="pointer-events-none select-none" aria-hidden="true">
          <Hopper pose="wave" className="h-28 w-20 drop-shadow-lg" />
        </div>
        <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black text-ink">
          Ask Hopper first
        </h2>
        <p className="mt-3 max-w-md font-body text-ink/80">
          The rabbit knows the projects, the pricing ranges, and which certs are in the oven. It answers from
          the live project list — so it never goes stale.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={open}
            className="rounded-full bg-ink px-7 py-3.5 font-display text-base font-extrabold text-paper shadow-chunky transition-transform hover:-translate-y-0.5"
          >
            Chat with Hopper →
          </button>
          <button
            onClick={open}
            className="rounded-full border-2 border-ink/40 px-6 py-3 font-display text-base font-extrabold text-ink transition-colors hover:border-ink"
          >
            How much does a site cost?
          </button>
        </div>
      </div>
    </section>
  );
}