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
        display: ["30px", { lineHeight: "34px", fontWeight: "800", letterSpacing: "-0.6px" }],
        title: ["21px", { lineHeight: "26px", fontWeight: "800", letterSpacing: "-0.2px" }],
        body: ["16px", { lineHeight: "23px", fontWeight: "500" }],
        caption: ["13px", { lineHeight: "17px", fontWeight: "600" }],
        eyebrow: ["11px", { lineHeight: "14px", fontWeight: "800", letterSpacing: "1px" }],
        reading: ["17px", { lineHeight: "29px" }],
      },
      borderRadius: {
        card: "14px",
        pill: "999px",
      },
      borderWidth: {
        3: "3px",
        2.5: "2.5px",
      },
    },
  },
  plugins: [],
};
