/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sejda: {
          green: '#2c8a77',
          'green-hover': '#247363',
          'green-light': '#e8f5f1',
          'green-border': '#b8e2d8',
          teal: '#00bb88',
          dark: '#2d3748',
          subtle: '#4a5568',
          bg: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      boxShadow: {
        'sejda': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'sejda-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

