const { transform } = require('next/dist/build/swc');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeinleft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)'
          },
          '10%': {
            opacity: '1',
          },
          '100%': {
            opacity: '2',
            transform: 'translateX(0px)'
          }
        },
        fadeinright: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)'
          },
          '10%': {
            opacity: '1',
          },
          '100%': {
            opacity: '2',
            transform: 'translateX(0px)'
          },
        },
        fadeinright1: {
          '0%': {
            opacity: '0',
            transform: 'translateX(10px)'
          },
          '10%': {
            opacity: '1',
          },
          '100%': {
            opacity: '2',
            transform: 'translateX(0px)'
          }
        },
        fadeup: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '2',
            transform: 'translateY(0px)'
          }
        },
        fadeup2: {
          '0%': {
            opacity: '1',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '2',
            transform: 'translateY(0px)'
          }
        },
      },
      animation: {
        'fadeinleft': 'fadeinleft 2s linear ',
        'fadeinleft2': 'fadeinleft 6s linear  infinite',
        'fadeinright': 'fadeinright 2s linear',
        'fadeinright2': 'fadeinright 6s linear  infinite',
        'fadein': 'fadeinright1 1s linear',
        'fadeup': 'fadeup 2s linear',
        'fadeup2': 'fadeup2 1s ease-in'
      },
      colors: {
        accent: '#EF1D26',
        bodytextcolor: "var(--body-text-color)",
        themebglight: "var(--theme-bg-light)"
      },
    },
  },
  plugins: [],
};
