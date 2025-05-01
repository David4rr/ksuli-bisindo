/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         poppins: ["Poppins", "sans-serif"],
//       },
//       container: {
//         center: true,
//         padding: "1rem",
//       },
//       colors: {
//         ground: "#f5f5f5",
//       },
//     },
//   },
//   plugins: [daisyui],
//   daisyui: {
//     themes: [
//       {
//         myTheme: {
//           primary: "#004e89",
//           secondary: "#1a659e",
//           accent: "#FF6B35",
//           neutral: "#efefd0",
//           "base-100": "#f7c59f",
//           info: "#2094f3",
//           warning: "#ff9900",
//           error: "#ff0000",
//           success: "#00aa00",
//         },
//       },
//     ],
//   },
// };

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // Pastikan jalur file sudah benar
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
      colors: {
        primary: "#004e89",
        secondary: "#1a659e",
        accent: "#FF6B35",
        neutral: "#efefd0",
        base100: "#f7c59f",
        info: "#2094f3",
        warning: "#ff9900",
        error: "#ff0000",
        success: "#00aa00",
      },
    },
  },
  plugins: [daisyui], // Pastikan plugin DaisyUI diimpor dengan benar
  daisyui: {
    themes: [
      {
        myTheme: {
          primary: "#004e89",
          secondary: "#1a659e",
          accent: "#FF6B35",
          neutral: "#efefd0",
          "base-100": "#f7c59f",
          info: "#2094f3",
          warning: "#ff9900",
          error: "#ff0000",
          success: "#00aa00",
        },
      },
    ],
  },
};
