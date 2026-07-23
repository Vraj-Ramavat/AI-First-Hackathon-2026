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
        base: "#0D0B08",
        surface: "#141210",
        "surface-2": "#1C1915",
        "text-primary": "#F2EDE4",
        "text-secondary": "#7A7470",
        accent: {
          DEFAULT: "#C9A84C",
          hover: "#D8B85C",
          muted: "rgba(201, 168, 76, 0.15)",
        },
        hairline: "rgba(242, 237, 228, 0.08)",
        status: {
          stock: "#4ADE80",
          low: "#F59E0B",
          critical: "#EF4444",
        }
      },
      borderColor: {
        DEFAULT: "rgba(242, 237, 228, 0.08)",
        hairline: "rgba(242, 237, 228, 0.08)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
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
