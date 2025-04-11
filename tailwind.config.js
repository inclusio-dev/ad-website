/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
