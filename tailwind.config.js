/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1F3D',
          light: '#162847',
          mid: '#1E3A5F',
        },
        sky: {
          brand: '#2A7FD4',
          light: '#4A9FE4',
        },
        amber: {
          brand: '#E8A020',
          light: '#F0B830',
          dark: '#C47010',
        },
        bg: {
          DEFAULT: '#FAF9F6',
          warm: '#F4F1EC',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(15, 31, 61, 0.08)',
        'card-lg': '0 12px 48px rgba(15, 31, 61, 0.14)',
        'amber': '0 8px 32px rgba(232, 160, 32, 0.25)',
      },
    },
  },
  plugins: [],
};