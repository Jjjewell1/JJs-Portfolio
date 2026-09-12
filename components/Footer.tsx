"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ICONS: Record<string, string> = {
  github: "GH",
  email: "✉",
  linkedin: "in",
  twitter: "𝕏",
  x: "𝕏",
  instagram: "◉",
  youtube: "▶",
};

export default function FooterClient({ links }: { links: { platform: string; url: string }[] }) {
  const router = useRouter();
  const clicks = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        router.push("/command-center");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const pawTap = () => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 3000);
    if (clicks.current >= 3) {
      clicks.current = 0;
      router.push("/command-center");
    }
  };

  return (
    <footer className="relative border-t-4 border-court bg-ink py-14 text-paper">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-3xl font-black text-paper">
              JEWELLCORE<span className="text-court">®</span>
            </p>
            <p className="mt-1 font-body text-sm text-paper/60">
              Websites, hosting, and homelab-admin that actually ship.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {links.map((l) => (
              <a
                key={l.platform}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-paper/25 font-display text-sm font-extrabold text-paper transition-colors hover:border-electric hover:text-electric"
                style={{ letterSpacing: "0.02em" }}
              >
                {ICONS[l.platform.toLowerCase()] ?? "↗"}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-paper/10 pt-6">
          <button
            onClick={pawTap}
            aria-label="site mark"
            className="cursor-pointer opacity-40 transition-opacity hover:opacity-80"
            title="©"
          >
            <PawMark />
          </button>
          <p className="font-body text-xs text-paper/50">
            © {new Date().getFullYear()} JJ Jewell · built + hosted at home
          </p>
        </div>
      </div>
    </footer>
  );
}

function PawMark() {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none" aria-hidden="true">
      <ellipse cx="13" cy="16" rx="6" ry="5" fill="currentColor" />
      <circle cx="5" cy="9" r="2.6" fill="currentColor" />
      <circle cx="11" cy="5.5" r="2.6" fill="currentColor" />
      <circle cx="18.5" cy="8" r="2.6" fill="currentColor" />
      <circle cx="6.5" cy="4.5" r="1.8" fill="currentColor" />
    </svg>
  );
}