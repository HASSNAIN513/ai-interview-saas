/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#8b5cf6', // Violet
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                secondary: {
                    500: '#ec4899', // Pink
                    600: '#db2777',
                },
                accent: {
                    400: '#22d3ee', // Cyan
                    500: '#06b6d4',
                },
                gray: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a', // Slate
                    950: '#020617',
                },
                neutral: {
                    800: '#0f172a',
                    900: '#020617',
                },
                surface: {
                    100: '#ffffff',
                }
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to bottom right, var(--color-neutral-900), var(--color-neutral-900), #4c1d95)',
            },
            scale: {
                '103': '1.03',
            },
        },
    },
    plugins: [],
}
