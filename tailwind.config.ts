import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        'base': ['0.8rem', '1rem'],  // 18px avec un line-height de 28px
        'lg': ['1.25rem', '1.875rem'],    // 20px avec un line-height de 30px
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      fontWeight: {
        'thin': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#0000CC',
        'primary-dark': '#6666FF',
        'bg-light': '#F9F9F9',
        'bg-dark': '#0E0D09',
        'text-light': '#0E0D09',
        'text-dark': '#B0B0B0',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#0E0D09',
            a: {
              color: '#0000CC',
              '&:hover': {
                color: '#0000AA',
              },
            },
            h1: {
              color: '#0E0D09',
            },
            h2: {
              color: '#0E0D09',
            },
            h3: {
              color: '#0E0D09',
            },
            h4: {
              color: '#0E0D09',
            },
            code: {
              color: '#0E0D09',
              backgroundColor: '#F1F1F1',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
          },
        },
        invert: {
          css: {
            color: '#B0B0B0',
            a: {
              color: '#6666FF',
              '&:hover': {
                color: '#8888FF',
              },
            },
            h1: {
              color: '#B0B0B0',
            },
            h2: {
              color: '#B0B0B0',
            },
            h3: {
              color: '#B0B0B0',
            },
            h4: {
              color: '#B0B0B0',
            },
            code: {
              color: '#B0B0B0',
              backgroundColor: '#1A1A1A',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
