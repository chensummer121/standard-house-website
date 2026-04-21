import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // African earth tones palette
        earth: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#e8dfd0",
          300: "#d4c4a8",
          400: "#c4a97a",
          500: "#b8954a",
          600: "#a67c32",
          700: "#8a6228",
          800: "#725026",
          900: "#5e4322",
          950: "#3d2b14",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e4ebe4",
          200: "#c9d7c9",
          300: "#a3bba3",
          400: "#749774",
          500: "#557755",
          600: "#426043",
          700: "#364d36",
          800: "#2d3f2d",
          900: "#273528",
          950: "#131c13",
        },
        terracotta: {
          50: "#fdf6f3",
          100: "#fae9e1",
          200: "#f5cfc1",
          300: "#edab91",
          400: "#e27f5a",
          500: "#d55d34",
          600: "#c7451f",
          700: "#a7361a",
          800: "#872e1a",
          900: "#6e2717",
          950: "#3e1309",
        },
        sand: {
          50: "#fdfcfb",
          100: "#f9f6f0",
          200: "#f2ece0",
          300: "#e8dcc4",
          400: "#d9c5a0",
          500: "#cbb07e",
          600: "#bfa164",
          700: "#9e8050",
          800: "#816643",
          900: "#695538",
          950: "#382d1d",
        },
        primary: {
          DEFAULT: "#b8954a",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#426043",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#c7451f",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
