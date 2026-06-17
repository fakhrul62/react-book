/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10201b",
        paper: "#f7fbf8",
        linen: "#e4f1ea",
        moss: "#2f7d62",
        plum: "#0f766e",
        gilt: "#f97316"
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
