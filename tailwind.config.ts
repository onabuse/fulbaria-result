import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#171717",
        card: "#1c1c1c",
        line: "#252525",
        tile: "#2f2f2f",
        accent: "#60a5fa",
        "accent-active": "#1e6dd4",
        ink: "#ededed",
        muted: "#a9a9a9",
        label: "#5187c7",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};

export default config;
