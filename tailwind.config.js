/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15130f",
        paper: "#faf7f0",
        linen: "#efe6d6",
        moss: "#3f5f4a",
        plum: "#7b3f55",
        gilt: "#b98746"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
        soft: ["var(--font-soft)", "Arial", "sans-serif"]
      },
      boxShadow: {
        book: "0 24px 70px rgba(21, 19, 15, 0.16)"
      }
    }
  },
  plugins: []
};

export default tailwindConfig;
