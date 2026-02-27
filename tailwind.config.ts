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
        bg: {
          base:     '#020617',
          surface:  '#0f172a',
          elevated: '#1e293b',
        },
        accent: {
          cyan:         '#06b6d4',
          'cyan-dim':   '#0891b2',
          'cyan-glow':  'rgba(6,182,212,0.15)',
          purple:       '#8b5cf6',
          'purple-dim': '#7c3aed',
          'purple-glow':'rgba(139,92,246,0.15)',
        },
        text: {
          primary:   '#f8fafc',
          secondary: '#94a3b8',
          muted:     '#475569',
        },
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
        'glow-cyan':  '0 0 20px rgba(6,182,212,0.3), 0 0 60px rgba(6,182,212,0.1)',
        'glow-purple':'0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
        'card-hover': '0 0 0 1px rgba(6,182,212,0.2), 0 8px 32px rgba(0,0,0,0.5)',
      },
      borderColor: {
        DEFAULT:       'rgba(255,255,255,0.08)',
        hover:         'rgba(255,255,255,0.15)',
        'accent-cyan': 'rgba(6,182,212,0.3)',
      },
      animation: {
        'fade-up':    'fadeUp 0.7s ease both',
        'fade-in':    'fadeIn 0.6s ease both',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'blob':       'blob 9s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
}

export default config
