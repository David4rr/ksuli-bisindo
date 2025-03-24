/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      colors: {
        ground: "#f5f5f5",
      }
    },
  },
  daisyui: {
    themes: [{
      myTheme: {
        primary: "#004e89",        
        secondary: "#1a659e",      
        accent: "#ff6b35",         
        neutral: "#efefd0",        
        "base-100": "#f7c59f",     
        info: "#2094f3",           
        warning: "#ff9900",        
        error: "#ff0000",          
        success: "#00aa00",        
      }
    }
    ]
  },
  plugins: [daisyui],
}

