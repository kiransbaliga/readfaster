/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        warm: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          surface: 'var(--bg-secondary)',
          border: 'var(--border-color)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          'accent-light': 'var(--accent-light)',
        }
      }
    },
  },
  plugins: [],
}
