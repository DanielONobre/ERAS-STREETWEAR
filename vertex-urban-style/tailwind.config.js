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
                    50:  '#fefce8',
                    100: '#fdf5c3',
                    200: '#fbe68c',
                    300: '#f7d04e',
                    400: '#e8ac25',
                    500: '#C8932E',   // ← brand mustard
                    600: '#a87822',
                    700: '#895f1a',
                    800: '#6e4b15',
                    900: '#593c0f',
                    950: '#3a270b',
                    DEFAULT: '#C8932E',
                },
                accent: {
                    50:  '#fef8ef',
                    100: '#fdf0db',
                    200: '#faddb8',
                    300: '#f4be87',
                    400: '#e8975a',
                    500: '#d87232',
                    600: '#b85926',
                    700: '#7A4A1F',   // ← brand rust
                    800: '#5f3817',
                    900: '#472a10',
                    950: '#2e1a09',
                    DEFAULT: '#7A4A1F',
                },
                dark: {
                    DEFAULT: '#0F0F0F',
                    50:  '#161616',
                    100: '#1e1e1e',
                    200: '#282828',
                    300: '#333333',
                    400: '#3d3d3d',
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
                'glow-primary': '0 0 20px rgba(200, 147, 46, 0.35)',
                'glow-accent':  '0 0 20px rgba(122, 74, 31, 0.35)',
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
