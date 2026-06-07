import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        palm: "#146c43",
        sun: "#f5b841",
        clay: "#b75d32"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
