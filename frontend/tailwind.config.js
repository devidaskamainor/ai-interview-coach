/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10202E',
        paper: '#F4F6F8',
        line: '#D8DEE4',
        muted: '#5B6B7A',
        signal: { DEFAULT: '#2447F5', dark: '#1A35BF', soft: '#E7EBFE' },
        good: '#1B8A5A',
        warn: '#B7791F',
        bad: '#B93A32',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
