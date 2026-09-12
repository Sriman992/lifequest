import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dusk: "#232A36",
        panel: "#2E3644",
        panelSoft: "#37414F",
        lampAmber: "#E8A24B",
        parchment: "#EDE3D3",
        parchmentDim: "#B9AF9E",
        sage: "#7C9473",
        dustyRose: "#C97C82",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-karla)", "sans-serif"],
      },
      borderRadius: {
        cozy: "16px",
      },
      boxShadow: {
        lamp: "0 0 40px 6px rgba(232,162,75,0.25)",
        soft: "0 4px 14px rgba(0,0,0,0.25)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        flicker: "flicker 3.5s ease-in-out infinite",
        pop: "pop 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
