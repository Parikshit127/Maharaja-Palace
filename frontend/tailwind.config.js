/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal gold/beige palette
        gold: '#B8860B',
        darkGold: '#8B6914',
        lightGold: '#DAA520',
        cream: '#FAF9F6',
        lightText: '#6B7280',
      },

      fontFamily: {
        // Primary luxury heading font
        playfair: ['"Playfair Display"', 'serif'],

        // Alternate classy serif (optional, premium look)
        lora: ['"Lora"', 'serif'],

        // Generic serif (fallback)
        serif: ['Playfair Display', 'Georgia', 'serif'],

        // Body font
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      animation: {
        fadeIn: 'fadeIn 1s ease-in',
        slideUp: 'slideUp 0.8s ease-out',
        slideDown: 'slideDown 0.8s ease-out',
        fadeInSlow: 'fadeIn 1.8s ease-in',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
