import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        card: '#111827',
        accent: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444'
      }
    }
  },
  plugins: []
};

export default config;
