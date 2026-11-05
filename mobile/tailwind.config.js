const { colors, fonts } = require("./src/theme/tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        heading: [fonts.heading],
        ui: [fonts.ui],
        reading: [fonts.reading],
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
