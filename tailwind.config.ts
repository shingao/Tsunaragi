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
        background: '#FAFAF7',
        foreground: '#1A1A1A',
        accent: '#2E3A8C',
        border: '#E0E0DA',
        muted: '#767672',
        'muted-bg': '#F0F0EC',
      },
      fontFamily: {
        mono: ['var(--font-space-mono)', 'Space Mono', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '4px',
        full: '9999px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.06)',
        card: '0 1px 4px rgba(0,0,0,0.08)',
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
