import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-electric", "text-amber", "text-grape", "text-paper",
    "bg-electric", "bg-amber", "bg-grape", "bg-paper",
    "bg-electric/10", "bg-amber/10", "bg-grape/10", "bg-paper/10",
    "bg-electric/70", "bg-amber/70", "bg-grape/70", "bg-paper/70",
    "border-electric/30", "border-amber/30", "border-grape/30", "border-paper/30",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        paper: "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        court: "var(--court-orange)",
        "court-deep": "var(--court-deep)",
        electric: "var(--electric-cyan)",
        "electric-deep": "var(--electric-deep)",
        grape: "var(--grape)",
        slatey: "var(--slate)",
        void: "var(--void)",
        "void-soft": "var(--void-soft)",
        amber: "var(--amber)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ["Cabinet Grotesk", "Satoshi", "system-ui", "sans-serif"],
        body: ["Satoshi", "system-ui", "sans-serif"],
      },
      boxShadow: {
        chunky: "0 4px 0 0 rgba(20,23,43,0.9)",
        "chunky-cyan": "0 4px 0 0 rgba(20,23,43,0.9)",
      },
    },
  },
  plugins: [],
};
export default config;
