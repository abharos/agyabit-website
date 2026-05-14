/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Agyabit brand
        bg: '#0D0D1A',       // deep navy background
        primary: '#2F3E5C',  // anthracite-blue (dark steel)
        accent: '#6B7FA0',   // medium anthracite-blue for accents / borders
        ink: '#E6E8F2',      // off-white body text on dark
      },
    },
  },
  plugins: [],
}
