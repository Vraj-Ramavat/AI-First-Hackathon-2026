import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--background)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "rgba(201, 168, 76, 0.15)",
        },
        hairline: "var(--border-color)",
        status: {
          stock: "#4ADE80",
          low: "#F59E0B",
          critical: "#EF4444",
        }
      },
      borderColor: {
        DEFAULT: "var(--border-color)",
        hairline: "var(--border-color)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Teko", "Oswald", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan 2.5s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
