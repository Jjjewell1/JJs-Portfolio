import ImageResponse from "next/og";
import { readFileSync } from "fs";
import path from "path";

const FONTS_DIR = process.cwd();

// Load the brand fonts at module scope so ImageResponse can embed them.
// These were downloaded from Fontshare into public/fonts earlier.
const fonts = [
  { data: readFileSync(path.join(FONTS_DIR, "cabinet-grotesk-800.ttf")), family: "Cabinet Grotesk", style: "Normal" },
  { data: readFileSync(path.join(FONTS_DIR, "cabinet-grotesk-900.ttf")), family: "Cabinet Grotesk", style: "Normal" },
  { data: readFileSync(path.join(FONTS_DIR, "satoshi-400.ttf")), family: "Satoshi", style: "Normal" },
  { data: readFileSync(path.join(FONTS_DIR, "satoshi-500.ttf")), family: "Satoshi", style: "Normal" },
  { data: readFileSync(path.join(FONTS_DIR, "satoshi-700.ttf")), family: "Satoshi", style: "Normal" },
];

// ── SVG logo mark (256×256 viewBox), used as inline <svg> in the OG card ──
// Mark: a gem‑cut jewel whose crown splits into two rabbit‑ear shapes; a grape‑coloured
// “core” orb sits at the gem’s centre; a dotted orbit ring and tiny satellite complete the
// homelab‑core motif.
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none">
  <!-- Ears (electric cyan) -->
  <path d="M55 62 C49 46 41 34 29 20" stroke="#2FD4E0" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M73 62 C77 46 85 34 97 20" stroke="#2FD4E0" stroke-width="13" stroke-linecap="round" fill="none"/>
  <!-- Gem body (court‑orange gradient implied by fills below) -->
  <!-- Inner facet lines (ink) -->
  <path d="M64 50 L54 66" stroke="#14172B" stroke-width="4"/>
  <path d="M64 50 L74 66" stroke="#14172B" stroke-width="4"/>
  <path d="M47 76 L81 76" stroke="#14172B" stroke-width="4"/>
  <path d="M64 76 L64 114" stroke="#14172B" stroke-width="4"/>
  <path d="M50 114 L64 96" stroke="#14172B" stroke-width="4"/>
  <path d="M78 114 L64 96" stroke="#14172B" stroke-width="4"/>
  <!-- Core orb (grape) -->
  <circle cx="64" cy="88" r="13" fill="#7C5CFC"/>
  <!-- Highlight on core -->
  <circle cx="59" cy="83" r="4" fill="#C9B8FF"/>
  <!-- Tiny sparkle top‑right of gem -->
  <path d="M96 36 L99 44 L107 47 L99 50 L96 58 L93 50 L85 47 L93 44 Z" fill="#F7F5F2"/>
  <!-- Orbit ring + satellite (stand‑alone only; omitted in favicon) -->
  <ellipse cx="128" cy="130" rx="114" ry="88" fill="none" stroke="#7C5CFC" stroke-width="3"
    stroke-dasharray="3 16" transform="rotate(-14 128 130)"/>
  <circle cx="212" cy="64" r="9" fill="#2FD4E0"/>
</svg>`;

// ── Card layout (1200×630) ──
export function ogCard() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#14172B",
        color: "#F7F5F2",
        fontFamily: "Satoshi, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Soft gradient glows */}
      <div
        style={{
          position: "absolute",
          left: -160,
          top: -200,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,122,41,0.38), rgba(255,122,41,0) 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -180,
          bottom: -240,
          width: 720,
          height: 720,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,92,252,0.32), rgba(124,92,252,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "22%",
          top: -140,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(47,212,224,0.22), rgba(47,212,224,0) 60%)",
        }}
      />
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(247,245,242,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(247,245,242,0.05) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
      {/* Outer frame */}
      <div style={{ position: "absolute", inset: 22, border: "2px solid rgba(247,245,242,0.14)", borderRadius: 26 }} />
      {/* Top‑left electric accent */}
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 22,
          width: 36,
          height: 36,
          borderRadius: 6,
          background: "#2FD4E0",
          opacity: 0.4,
        }}
      />
      {/* Bottom‑right court accent */}
      <div
        style={{
          position: "absolute",
          right: 22,
          bottom: 22,
          width: 36,
          height: 36,
          borderRadius: 6,
          background: "#FF7A29",
          opacity: 0.4,
        }}
      />
      {/* Content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 72,
          gap: 48,
        }}
      >
        {/* Left: logo mark */}
        <div style={{ flexShrink: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            style={{ width: 168, height: 168, marginBottom: 24 }}
          >
            {LOGO_SVG}
          </svg>
          <div
            style={{
              textAlign: "center",
              fontSize: 20,
              fontFamily: "Satoshi, system-ui, sans-serif",
              color: "#2FD4E0",
              letterSpacing: 4,
            }}
          >
            ⦿ JEWELLCORE · HOPPER SAYS HI
          </div>
        </div>

        {/* Right: headline + tagline */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 22,
              fontFamily: "Cabinet Grotesk, system-ui, sans-serif",
              fontWeight: 700,
              color: "#FF7A29",
              letterSpacing: 6,
            }}
          >
            JJ JEWELL · JEWELLCORE
          </div>

          {/* Title (two‑line) */}
          <div style={{ fontFamily: "Cabinet Grotesk, system-ui, sans-serif", fontWeight: 900 }}>
            <span style={{ color: "#14172B" }}>I MOWED LAWNS</span>
            <span style={{ color: "#FF7A29" }}> FOR A DECADE.</span>
          </div>

          {/* Sub‑copy */}
          <div
            style={{
              fontFamily: "Satoshi, system-ui, sans-serif",
              fontSize: 26,
              color: "#C9C5BC",
            }}
          >
            Now I&apos;m building software, homelabs & AI — self‑hosted from my own rack.
          </div>

          {/* Bottom meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 24,
              fontFamily: "Satoshi, system-ui, sans-serif",
            }}
          >
            {/* Pill */}
            <div
              style={{
                display: "inline-flex",
                padding: "14px 26px",
                borderRadius: 999,
                background: "rgba(47,212,224,0.18)",
                border: "1px solid #2FD4E0",
                fontSize: 20,
                fontFamily: "Satoshi, system-ui, sans-serif",
                fontWeight: 500,
                color: "#2FD4E0",
              }}
            >
              ◍ JEWELLCORE · HOPPER SAYS HI
            </div>

            {/* Domain */}
            <span
              style={{
                fontSize: 24,
                fontFamily: "Satoshi, system-ui, sans-serif",
                fontWeight: 500,
                letterSpacing: 2,
                color: "#7C5CFC",
              }}
            >
              jjs.jewellcore.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Exported ImageResponse wrappers ──
/* eslint-disable @typescript-eslint/no-explicit-any */
// OpenGraph: 1200×630 summary_large_image
export const opengraph = new (ImageResponse as any)(
  ogCard,
  {
    width: 1200,
    height: 630,
    fonts,
    contentType: "image/png",
  }
);
export const twitter = new (ImageResponse as any)(
  ogCard,
  {
    width: 1200,
    height: 630,
    fonts,
    contentType: "image/png",
  }
);
/* eslint-enable @typescript-eslint/no-explicit-any */