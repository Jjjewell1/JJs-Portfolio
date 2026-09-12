interface SkillGroup {
  title: string;
  blurb: string;
  accent: "court" | "electric" | "grape";
  items: string[];
}

const GROUPS: SkillGroup[] = [
  {
    title: "Web Development & Design",
    blurb: "WordPress, Elementor Pro, PHP, Tailwind, Next.js — custom or CMS, whichever fits the client.",
    accent: "court",
    items: ["WordPress", "Elementor Pro", "PHP", "Tailwind CSS", "Next.js", "SQLite / Prisma"],
  },
  {
    title: "Systems & DevOps",
    blurb: "A homelab that runs real sites: Unraid, Docker, Coolify, and Cloudflare all the way to the public.",
    accent: "electric",
    items: ["Unraid", "Docker", "Coolify", "Cloudflare Tunnels", "Nginx Proxy Manager", "Tailscale", "AdGuard Home", "Traefik"],
  },
  {
    title: "AI Integration",
    blurb: "Local models on my own hardware, wired into real workflows. No cloud dependency unless I want one.",
    accent: "grape",
    items: ["Ollama", "Open WebUI", "ComfyUI", "LM Studio", "Cline", "OpenCode", "AnythingLLM"],
  },
  {
    title: "Hardware & Fabrication",
    blurb: "If I can hold it or print it, I probably do. CAD to filament to a server that hums.",
    accent: "court",
    items: ["3D Printing", "CAD", "Bambu Lab", "Raspberry Pi", "Network gear", "Pinball repairs"],
  },
];

const ACCENT_TEXT: Record<SkillGroup["accent"], string> = {
  court: "text-court",
  electric: "text-electric",
  grape: "text-grape",
};

const ACCENT_BAR: Record<SkillGroup["accent"], string> = {
  court: "bg-court",
  electric: "bg-electric",
  grape: "bg-grape",
};

export default function Skills() {
  return (
    <section id="skills" data-scroll-pose="point" className="relative bg-paper-deep py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-lg font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black text-ink">
            Tools I actually reach for
          </h2>
          <p className="max-w-sm font-body text-ink/70">
            Listed like stack cards, because that&apos;s how you flip through a crate of records — actually, these are grouped by job.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {GROUPS.map((g) => (
            <div
              key={g.title}
              className="relative overflow-hidden rounded-2xl border-2 border-ink bg-paper p-6 shadow-chunky"
            >
              <span className={`absolute left-0 top-0 h-full w-2 ${ACCENT_BAR[g.accent]}`} aria-hidden="true" />
              <h3 className="font-display text-2xl font-extrabold text-ink">{g.title}</h3>
              <p className="mt-1 font-body text-sm text-slatey">{g.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-xs font-medium text-ink ${
                      ACCENT_TEXT[g.accent]
                    } hover:bg-ink hover:text-paper transition-colors`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}