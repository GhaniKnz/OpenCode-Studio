/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0d0d10',
        surface: '#16161a',
        'surface-hover': '#1c1c22',
        border: '#2a2a35',
        'border-subtle': '#1e1e28',
        accent: '#7c6af0',
        'accent-hover': '#6b59e0',
        'accent-subtle': '#7c6af015',
        muted: '#6b6b7e',
        'muted-foreground': '#9898a8',
        foreground: '#e8e8f0',
        'foreground-secondary': '#b0b0be',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.375rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
