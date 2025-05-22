module.exports = {
    darkMode: "class",
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      screens: {
        sm: "780px", // Remplacez la valeur par défaut (640px) par 780px
        md: "1024px",
        lg: "1280px",
        xl: "1536px",
      },
      extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
  };
  