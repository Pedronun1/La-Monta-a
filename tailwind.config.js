/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        castizo: {
          50: "#FDF8F4",
          100: "#FAF0E6",
          200: "#F3DEC8",
          500: "#B45309",
          600: "#9A3412",
          700: "#7C2D12",
          800: "#5C1D0E",
          900: "#3B1108"
        },
        terracotta: "#8B261D",
        gold: "#D97706",
        parchment: "#FAF6F0",
        charcoal: "#1C1917"
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
