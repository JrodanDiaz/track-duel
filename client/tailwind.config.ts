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
      keyframes: {
        "scroll": {
          "0%": {transform: "translateX(100%)"},
          "100%": {transform: "translateX(-100%)"}

        },
        "marquee-keyframe": {
          "0%": {transform: "translateX(-100%)"},
          "100%": {transform: "translateX(100%)"}
        },
        "oscillate-keyframe": {
          "0%": {
            transform: "translateX(-90px)"
          },
          "50%": {transform: "translateX(90px)"},
          "100%": {transform: "translateX(-90px)"}
        }
      },
      animation: {
        scroll: 'scroll 15s linear infinite',
        oscillate: 'oscillate-keyframe 3s linear infinite',
        marquee: 'marquee-keyframe 6s linear infinite',
        reverseMarquee: 'scroll 6s linear infinite'
      
      },
      fontFamily: {
        "bebas": ["Bebas Neue, sans-serif"],
        "protest": ["Protest Strike, sans-serif"],
        "kanit": ["Kanit, sans-serif"],
        "lato": ["Lato, sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
