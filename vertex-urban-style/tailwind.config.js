import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx,ts,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'eras-black':    '#0F0F0F',
                'eras-bone':     '#F5F1EA',
                'eras-mustard':  '#C8932E',
                'eras-rust':     '#7A4A1F',
                'eras-concrete': '#4A4A4A',
                primary: {
                    50:  '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',   // ← brand primary
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                    DEFAULT: '#0d9488',
                },
                accent: {
                    50:  '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',   // ← brand accent
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                    DEFAULT: '#f97316',
                },
                dark: {
                    DEFAULT: '#080d14',
                    50:  '#0d1520',
                    100: '#111c2a',
                    200: '#172435',
                    300: '#1e2f44',
                    400: '#263c56',
                },
                neutral: {
                    ...defaultTheme.colors?.neutral,
                    850: '#1f1f1f',
                },
            },
            fontFamily: {
                display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
                body:    ['Inter', 'system-ui', 'sans-serif'],
                sans:    ['Inter', 'system-ui', 'sans-serif'],
                mono:    ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(13, 148, 136, 0.35)',
                'glow-accent':  '0 0 20px rgba(249, 115, 22, 0.35)',
                'card':         '0 4px 24px rgba(0, 0, 0, 0.12)',
                'card-hover':   '0 8px 40px rgba(0, 0, 0, 0.20)',
            },
            animation: {
                'fade-in':      'fadeIn 0.3s ease-in-out',
                'slide-up':     'slideUp 0.4s ease-out',
                'slide-down':   'slideDown 0.3s ease-out',
                'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer':      'shimmer 1.5s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%':   { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)',    opacity: '1' },
                },
                slideDown: {
                    '0%':   { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)',     opacity: '1' },
                },
                shimmer: {
                    '0%':   { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition:  '200% 0' },
                },
            },
            backgroundImage: {
                'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'shimmer-gradient':   'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                'hero-pattern':       "url('/images/hero-bg.webp')",
            },
            transitionTimingFunction: {
                'bounce-sm': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            screens: {
                'xs': '480px',
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
            },
        },
    },
    plugins: [
        forms({
            strategy: 'class',
        }),
        typography,
    ],
};
