import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0052FF",
          blueDark: "#003BBD",
          blueLight: "#E5EDFF",
        },
        brutalBlack: "#000000",
        brutalWhite: "#FFFFFF",
        brutalGray: "#F4F6FA",
        brutalYellow: "#FFD600",
      },
      boxShadow: {
        brutalSm: "2px 2px 0px 0px #000000",
        brutal: "4px 4px 0px 0px #000000",
        brutalLg: "8px 8px 0px 0px #000000",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};
export default config;
