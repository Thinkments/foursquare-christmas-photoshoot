/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        holiday: {
          pine: '#0B3B24',       // Deep festive pine green
          pinedark: '#062416',   // Ultra dark forest
          pinelight: '#135937',  // Rich evergreen
          red: '#C41E3A',        // Holiday cardinal red
          reddark: '#9E152D',    // Deep crimson
          mistletoe: '#1B5E20',  // Warm mistletoe green
          gold: '#D4AF37',       // Champagne holiday gold
          goldlight: '#F3C053',  // Sparkling gold
          cream: '#FDFBF7',      // Warm festive parchment
          ice: '#F0F9FF',        // Crisp winter ice
          slate: '#0F172A',      // Midnight slate
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'snow-fall': 'snowFall 10s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        snowFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0.8' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0.2' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.92', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
};
