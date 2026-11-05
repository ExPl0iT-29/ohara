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
        display: ["28px", { lineHeight: "34px", fontWeight: "700", letterSpacing: "-0.2px" }],
        title: ["20px", { lineHeight: "26px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "500" }],
        eyebrow: ["11px", { lineHeight: "14px", fontWeight: "600", letterSpacing: "1.2px" }],
        reading: ["18px", { lineHeight: "30px" }],
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
