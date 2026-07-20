/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        paper: "#FAF3E1",
        surface: {
          DEFAULT: "#FAF3E1",
          dark: "#161412",
        },
        ink: {
          DEFAULT: "#1C1917",
          soft: "#57534E",
          faint: "#A8A29E",
        },
        brand: {
          DEFAULT: "#FFC933",
          dark: "#E6A800",
          light: "#FFF3D1",
        },
        accent: {
          yellow: "#FFC933",
          pink: "#FF5C8A",
          violet: "#8B5CF6",
          mint: "#34D399",
          blue: "#5B8DEF",
        },
        line: "#1C1917",
        danger: {
          DEFAULT: "#FF4D6D",
          light: "#FFE1E7",
        },
        amber: {
          DEFAULT: "#E6A800",
          light: "#FFF3D1",
        },
      },
      fontSize: {
        display: ["30px", { lineHeight: "34px", fontWeight: "800", letterSpacing: "-0.3px" }],
        title: ["22px", { lineHeight: "26px", fontWeight: "800" }],
        body: ["16px", { lineHeight: "24px" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "600" }],
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
