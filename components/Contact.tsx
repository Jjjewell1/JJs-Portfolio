"use client";

import { useRef, useState } from "react";
import { submitContact } from "../lib/actions";

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<{ ok: boolean; error?: string } | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (fd: FormData) => {
    setPending(true);
    setState(null);
    const res = await submitContact(fd);
    setPending(false);
    setState(res);
    if (res.ok) form.current?.reset();
  };

  return (
    <section id="contact" data-scroll-pose="point" className="relative bg-paper py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-light" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black text-ink">
              Let&apos;s build something
            </h2>
            <p className="mt-4 max-w-md font-body text-ink/75">
              A quick note, a real quote, no commitment. Every project starts with a conversation, not a deposit.
            </p>
            <div className="mt-8 rounded-2xl border-2 border-ink p-6">
              <p className="font-display text-xl font-extrabold text-ink">jj@jewellcore.com</p>
              <p className="mt-1 font-body text-sm text-slatey">Weeknights and weekends.</p>
            </div>
          </div>

          <form ref={form} action={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="font-display text-sm font-bold text-ink">Name *</span>
                <input name="name" required className="rounded-xl border-2 border-ink bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-electric" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-display text-sm font-bold text-ink">Email *</span>
                <input name="email" type="email" required className="rounded-xl border-2 border-ink bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-electric" />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-sm font-bold text-ink">Project type</span>
              <select name="projectType" className="rounded-xl border-2 border-ink bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-electric">
                <option value="">Choose one (optional)</option>
                <option value="website">Website / landing page</option>
                <option value="web_app">Custom web app</option>
                <option value="hosting">Hosting / management</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-sm font-bold text-ink">Tell me about it *</span>
              <textarea name="message" rows={4} required className="rounded-xl border-2 border-ink bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-electric" />
            </label>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-court px-6 py-3 font-display text-base font-extrabold text-ink shadow-chunky transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send it"}
            </button>

            {state && !state.ok && state.error && (
              <p className="text-sm text-court-deep">{state.error}</p>
            )}
            {state && state.ok && (
              <p className="font-body text-sm font-bold text-electric-deep">
                Thanks — got it. I&apos;ll get back to you soon.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}