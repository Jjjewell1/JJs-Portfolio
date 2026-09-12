import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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