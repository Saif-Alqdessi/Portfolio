import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn-standard names, theme-aware via CSS vars set in globals.css
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        // Existing design-token names — point at the SAME vars, so every
        // component already using them (the whole site) becomes theme-aware
        // for free, with no per-component edits required.
        bg: {
          base:     'hsl(var(--background) / <alpha-value>)',
          surface:  'hsl(var(--surface) / <alpha-value>)',
          elevated: 'hsl(var(--elevated) / <alpha-value>)',
        },
        // Brand accent — fixed cinematic orange/amber, deliberately identical
        // in both themes (never wired to --background/--foreground).
        accent: {
          cyan:         '#f97316',
          'cyan-dim':   '#ea580c',
          'cyan-glow':  'rgba(249,115,22,0.15)',
          purple:       '#f59e0b',
          'purple-dim': '#b45309',
          'purple-glow':'rgba(245,158,11,0.15)',
        },
        text: {
          primary:   'hsl(var(--foreground) / <alpha-value>)',
          secondary: 'hsl(var(--foreground-secondary) / <alpha-value>)',
          muted:     'hsl(var(--foreground-muted) / <alpha-value>)',
        },
        // Standard shadcn token names, for shadcn/ui primitives (Card, Badge,
        // Avatar, ...) pasted in from the wider ecosystem. Aliased onto the
        // same theme-aware vars/fixed brand values as the tokens above, so
        // these stay correctly light/dark-aware anywhere they're reused.
        primary:                '#f97316',
        'primary-foreground':   '#0c0a09',
        secondary:              'hsl(var(--elevated) / <alpha-value>)',
        'secondary-foreground': 'hsl(var(--foreground-secondary) / <alpha-value>)',
        muted:                  'hsl(var(--elevated) / <alpha-value>)',
        'muted-foreground':     'hsl(var(--foreground-muted) / <alpha-value>)',
        card:                   'hsl(var(--surface) / <alpha-value>)',
        'card-foreground':      'hsl(var(--foreground) / <alpha-value>)',
        destructive:            '#ef4444',
        'destructive-foreground': '#fafafa',
        ring:                   '#f97316',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.5rem,6vw,5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        section: ['clamp(1.75rem,3vw,2.5rem)', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        glass:        '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)',
        'glow-cyan':  '0 0 20px rgba(249,115,22,0.3), 0 0 60px rgba(249,115,22,0.1)',
        'glow-purple':'0 0 20px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1)',
        'card-hover': '0 0 0 1px rgba(249,115,22,0.2), 0 8px 32px rgba(0,0,0,0.5)',
      },
      borderColor: {
        DEFAULT:       'hsl(var(--foreground) / 0.08)',
        hover:         'hsl(var(--foreground) / 0.15)',
        'accent-cyan': 'rgba(249,115,22,0.3)',
      },
      animation: {
        'fade-up':      'fadeUp 0.7s ease both',
        'fade-in':      'fadeIn 0.6s ease both',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'blob':         'blob 9s ease-in-out infinite',
        'cursor-blink': 'cursorBlink 1.1s step-end infinite',
        'marquee-left': 'marqueeLeft 40s linear infinite',
        'marquee-right':'marqueeRight 40s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%':      { opacity: '1' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(25px, -25px) scale(1.05)' },
          '66%':      { transform: 'translate(-15px, 15px) scale(0.96)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        // Track content is duplicated 2x, so translating exactly -50% loops
        // seamlessly back to an identical copy of the start.
        marqueeLeft: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
