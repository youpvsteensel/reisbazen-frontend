/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        groen: '#1a5c38',
        'groen-licht': '#f0f7f4',
        'groen-mid': '#2e7d52',
        tekst: '#1a1a1a',
        muted: '#666666',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
        logo: ['Lobster', 'cursive'],
      },
    },
  },
  plugins: [],
};
