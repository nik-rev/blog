import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import tailwindAnimate from "tailwindcss-animate";
import tailwindReactAria from "tailwindcss-react-aria-components";

import { calloutAccent, calloutStylesArray } from "./src/lib/callout";

const config = {
  safelist: [...Object.values(calloutStylesArray).flat(), ...calloutAccent],
  darkMode: ["class"],
  content: ["./posts/**/*.mdx", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        tiny: "480px",
      },
      maxWidth: {
        article: "656.5px",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      colors: {
        rosewater: "hsl(var(--rosewater))",
        flamingo: "hsl(var(--flamingo))",
        pink: "hsl(var(--pink))",
        mauve: "hsl(var(--mauve))",
        red: "hsl(var(--red))",
        maroon: "hsl(var(--maroon))",
        peach: "hsl(var(--peach))",
        yellow: "hsl(var(--yellow))",
        green: "hsl(var(--green))",
        teal: "hsl(var(--teal))",
        sky: "hsl(var(--sky))",
        sapphire: "hsl(var(--sapphire))",
        blue: "hsl(var(--blue))",
        lavender: "hsl(var(--lavender))",
        text: "hsl(var(--text))",
        subtext1: "hsl(var(--subtext1))",
        subtext0: "hsl(var(--subtext0))",
        overlay2: "hsl(var(--overlay2))",
        overlay1: "hsl(var(--overlay1))",
        overlay0: "hsl(var(--overlay0))",
        surface2: "hsl(var(--surface2))",
        surface1: "hsl(var(--surface1))",
        surface0: "hsl(var(--surface0))",
        base: "hsl(var(--base))",
        mantle: "hsl(var(--mantle))",
        crust: "hsl(var(--crust))",
        accent: "hsl(var(--accent))",
      },
      keyframes: {
        "bounce-right": {
          "50%": {
            transform: "translateX(-25%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "0%, 100%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        "bounce-right": "bounce-right 1s infinite",
      },
    },
  },
  plugins: [
    tailwindAnimate,
    tailwindReactAria,
    plugin((p) => {
      p.addUtilities({
        ".bleed": {
          "@apply -mx-4 mt-6 mb-1 md:mb-2 p-4 md:-mx-8 md:mt-8 md:p-8": {},
        },
      });
    }),
  ],
} satisfies Config;

export default config;
