import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Brand colors
        brand: {
          primary: '#3ECF8E',
          secondary: '#1DB584',
          accent: '#00D9FF',
        },
        // Background colors (custom namespace)
        'background-primary': '#0F0F23',
        'background-secondary': '#181821',
        'background-tertiary': '#1E1E2E',
        'background-elevated': '#262640',
        'background-glass': 'rgba(30, 30, 46, 0.8)',
        // Text colors (custom namespace)
        'text-primary': '#FFFFFF',
        'text-secondary': '#B4B4B4',
        'text-muted': '#8B8B8B',
        'text-accent': '#3ECF8E',
        // Border colors (custom namespace)
        'border-primary': 'rgba(255, 255, 255, 0.1)',
        'border-secondary': 'rgba(255, 255, 255, 0.05)',
        'border-accent': 'rgba(62, 207, 142, 0.3)',
        // Shadcn/ui compatibility
        border: 'rgba(255, 255, 255, 0.1)',
        input: 'rgba(255, 255, 255, 0.05)',
        ring: '#3ECF8E',
        background: '#0F0F23',
        foreground: '#FFFFFF',
        primary: {
          DEFAULT: '#3ECF8E',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1E1E2E',
          foreground: '#B4B4B4',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1E1E2E',
          foreground: '#8B8B8B',
        },
        accent: {
          DEFAULT: '#262640',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#1E1E2E',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#1E1E2E',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'Monaco',
          '"Cascadia Code"',
          '"Roboto Mono"',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        '7xl': '4.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.125rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(62, 207, 142, 0.3)',
        'glow-large': '0 0 40px rgba(62, 207, 142, 0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3ECF8E 0%, #00D9FF 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #1E1E2E 0%, #262640 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-text': 'linear-gradient(135deg, #FFFFFF 0%, #B4B4B4 100%)',
        'gradient-hero': 'radial-gradient(ellipse at center, rgba(62, 207, 142, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-in-left': 'slideInLeft 0.6s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(62, 207, 142, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(62, 207, 142, 0.6)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config