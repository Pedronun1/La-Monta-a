/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050506",
        ivory: "#f4f4f5",
        champagne: "#d4af37"
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
