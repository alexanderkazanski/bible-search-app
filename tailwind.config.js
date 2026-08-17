/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
      },
      colors: {
        biblical: {
          gold: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
          crimson: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          parchment: {
            50: '#faf7f2',
            100: '#f5efe4',
            200: '#ebe2d1',
            300: '#e0d4bd',
            400: '#d5c5a8',
            500: '#c9b693',
            600: '#b89f78',
            700: '#9a8462',
            800: '#7c6a4e',
            900: '#635541',
          },
        },
      },
      backgroundImage: {
        'biblical-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'parchment-gradient': 'linear-gradient(180deg, #faf7f2 0%, #f5efe4 100%)',
      },
    },
  },
  plugins: [],
}