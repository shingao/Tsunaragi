import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Mycelia "Warm Welcome" palette
        bg: '#FBF5EC',
        surface: '#FFFBF3',
        'surface-alt': '#F5EBD9',
        text: '#1F1A15',
        muted: '#7A6F62',
        line: '#E5DACA',
        accent: '#C45A3D',
        'accent-hover': '#D96A4A',
        'accent-soft': '#F4D9CC',
        success: '#5A7A4A',
        'success-soft': '#DCE5D2',
        info: '#6B8CAE',
        // Aliases so old Tailwind classes (bg-background, etc.) still compile
        background: '#FBF5EC',
        foreground: '#1F1A15',
        border: '#E5DACA',
        'muted-bg': '#F5EBD9',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        full: '9999px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
        card: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

export default config
