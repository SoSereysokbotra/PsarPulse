import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "var(--font-suwannaphum)", "sans-serif"],
        khmer: ["var(--font-suwannaphum)", "sans-serif"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
