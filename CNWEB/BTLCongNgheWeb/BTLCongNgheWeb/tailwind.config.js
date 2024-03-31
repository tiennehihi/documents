/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm' : {'max': '660px'},
        'sm1': {'min': '661px', 'max' : '867px'},
        'md' : {'min': '768px', 'max': '1059px'},
        // 'lg': {'min': '1060px', 'max': '1279px'},
        'xl': '1280px',
        'xxl': '1320px'
      }
    },
  },
  plugins: [],
}

