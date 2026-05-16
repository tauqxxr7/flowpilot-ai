import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        panel: "#f7f6f2",
        line: "#dedbd2",
        accent: "#0f766e",
        signal: "#b45309",
      },
      boxShadow: {
        soft: "0 10px 24px rgba(23, 32, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
