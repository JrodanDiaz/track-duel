import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "main-black": "#0e100f",
        "offwhite": "#fffce1",
        "main-green": "#0ae448",
        "lilac": "#9d95ff",
        "lt-green": "#abff84",
        "orangey": "#ff8709",
        "main-pink": "#fec5fb",
        "shock-pink": "#f100cb",
        "main-blue": "#00bae2",
        "surface75": "#bbbaa6",
        "surface50": "#7c7c6f",
        "surface25": "#42433d"

      },
      fontFamily: {
        "bebas": ["Bebas Neue, sans-serif"],
        "protest": ["Protest Strike, sans-serif"],
        "kanit": ["Kanit, sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
