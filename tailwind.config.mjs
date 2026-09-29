/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        holiday: {
          velvet: '#3B030A',      // Ultra deep shadow wine
          wine: '#5A0612',        // Rich velvet burgundy wine
          burgundy: '#750B1A',    // Classic holiday burgundy
          crimson: '#9E0E21',     // Cardinal ruby crimson
          red: '#9E0E21',         // Primary holiday crimson
          redlight: '#BD162C',    // Vibrant holiday ruby
          scarlet: '#D81E35',     // Bright ribbon scarlet
          
          gold: '#D4AF37',        // Warm champagne metallic gold
          goldlight: '#F3D894',   // Sparkling champagne highlight
          golddark: '#997018',    // Deep antique bronze gold
          amber: '#C59B27',       // Warm amber glow
          champagne: '#FAF1DC',   // Soft champagne parchment
          cream: '#FCF8EE',       // Silk ribbon cream
          
          // Legacy aliases so existing components automatically receive flyer theme:
          pine: '#5A0612',        // Maps green -> flyer velvet wine
          pinedark: '#3B030A',    // Maps dark green -> flyer dark shadow wine
          pinelight: '#7D0C1B',   // Maps light green -> flyer ruby wine
          reddark: '#42040C',
          mistletoe: '#6B0916',
          ice: '#FFF8F8',
          slate: '#1A080B',
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Outfit', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
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
