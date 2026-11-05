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
        // M3 type scale, slightly emphasised for Expressive.
        display: ["34px", { lineHeight: "40px", fontWeight: "800", letterSpacing: "-0.5px" }],
        title: ["22px", { lineHeight: "28px", fontWeight: "700" }],
        body: ["16px", { lineHeight: "24px", letterSpacing: "0.15px" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "500", letterSpacing: "0.2px" }],
        eyebrow: ["12px", { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.5px" }],
        reading: ["17px", { lineHeight: "28px", letterSpacing: "0.1px" }],
      },
      borderRadius: {
        card: "24px",
        pill: "999px",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
