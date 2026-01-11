/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        kombinu: {
          primary: '#00FFFF', // Neon Blue
          accent: '#FFD700',  // Golden Yellow
          surface: '#F3F4F6',
          text: '#18181B',
          muted: '#6B7280',
          gold: '#EAB308',
          silver: '#CBD5E1',
          bronze: '#FBBF24',
          'neon-blue': '#00FFFF',
          'golden-yellow': '#FFD700',
          'dark-blue': '#0099CC', // Darker blue for better contrast
          'dark-gold': '#B8860B',  // Darker gold for better contrast
        },
        // Dark mode color system
        dark: {
          // Backgrounds
          'bg-primary': '#1a1a1a',      // Main background
          'bg-secondary': '#2d2d2d',    // Cards, containers
          'bg-tertiary': '#333333',     // Elevated elements
          'bg-hover': '#404040',        // Hover states
          'bg-active': '#4a4a4a',       // Active states
          
          // Text colors
          'text-primary': '#ffffff',    // Primary text
          'text-secondary': '#f5f5f5',  // Secondary text
          'text-muted': '#b0b0b0',      // Muted text
          'text-disabled': '#888888',   // Disabled text
          
          // Accent colors
          'accent-blue': '#4a9eff',     // Blue accent
          'accent-green': '#4ade80',    // Green accent
          'accent-yellow': '#fbbf24',   // Yellow accent
          'accent-red': '#ef4444',      // Red accent
          
          // Borders and dividers
          'border-primary': '#404040',  // Primary borders
          'border-secondary': '#4a4a4a', // Secondary borders
          'border-accent': '#555555',   // Accent borders
          
          // Interactive elements
          'interactive-primary': '#4a9eff',
          'interactive-secondary': '#6b7280',
          'interactive-success': '#4ade80',
          'interactive-warning': '#fbbf24',
          'interactive-error': '#ef4444',
        }
      },
      borderRadius: { 
        xl: '1rem', 
        '2xl': '1.5rem' 
      },
      spacing: { 
        '72': '18rem', 
        '80': '20rem' 
      }
    }
  },
  plugins: [],
};
