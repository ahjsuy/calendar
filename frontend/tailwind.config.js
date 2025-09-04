/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // or create custom key like `body: [...]`
      },
      colors: {
        mint: {
          500: "hsl(178, 100%, 50%)", // example mint color, replace with your preferred value
          // you can add more shades like 100, 200, 300... if you want
        },
        primary: {
          500: "#FFFFFF",
        },
        secondary: {
          900: "#14213D", // Original
          800: "#1E3A8A",
          700: "#1D4ED8",
          600: "#2563EB",
          500: "#3ABEFF",
          400: "#60A5FA",
          300: "#93C5FD",
        },
        accent: {
          500: "#FCA311",
        },
        card: {
          500: "#e9ecef",
        },
      },
    },
  },
  plugins: [],
};
