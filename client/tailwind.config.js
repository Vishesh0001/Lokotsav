/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        create: "rgb(222, 155, 184)",
        base: "rgb(250, 250, 220)",
        accent: "rgb(144, 224, 208)",
        accent2: "rgb(31, 210, 198)",
        extra: "rgb(161, 117, 232)"
      },
    },
  },
  plugins: [],
};