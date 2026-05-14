import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        panel: "#f7f8fb",
        line: "#d9dee8",
        accent: "#0f766e",
        signal: "#b45309",
      },
      boxShadow: {
        soft: "0 14px 35px rgba(17, 24, 39, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
