/** @type {import('tailwindcss').Config} */
export default {
   darkMode: ["class"],
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         colors: {
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            primary: {
               DEFAULT: "hsl(var(--primary))",
               foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
               DEFAULT: "hsl(var(--secondary))",
               foreground: "hsl(var(--secondary-foreground))",
            },
            destructive: {
               DEFAULT: "hsl(var(--destructive))",
               foreground: "hsl(var(--destructive-foreground))",
            },
            muted: {
               DEFAULT: "hsl(var(--muted))",
               foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
               DEFAULT: "hsl(var(--accent))",
               foreground: "hsl(var(--accent-foreground))",
            },
            popover: {
               DEFAULT: "hsl(var(--popover))",
               foreground: "hsl(var(--popover-foreground))",
            },
            card: {
               DEFAULT: "hsl(var(--card))",
               foreground: "hsl(var(--card-foreground))",
            },
            "surface-container-low": "#f1f4f7",
            "surface-container-high": "#e2e9ee",
            "on-tertiary": "#e9ffe7",
            "on-secondary": "#fff7f3",
            "on-primary-fixed-variant": "#5c5b5b",
            "tertiary-fixed-dim": "#70f090",
            "surface-variant": "#dbe4ea",
            "surface": "#f8f9fb",
            "tertiary-container": "#7fff9d",
            "secondary-dim": "#784800",
            "inverse-surface": "#0c0f10",
            "on-error-container": "#752121",
            "on-primary-container": "#525151",
            "surface-bright": "#f8f9fb",
            "secondary": "#885300",
            "surface-dim": "#d1dce2",
            "primary-fixed": "#e4e2e1",
            "background": "#f8f9fb",
            "tertiary-dim": "#00612b",
            "surface-container-highest": "#dbe4ea",
            "surface-container": "#eaeef2",
            "primary-container": "#e4e2e1",
            "on-primary": "#faf7f6",
            "on-error": "#fff7f6",
            "on-primary-fixed": "#3f3f3f",
            "on-tertiary-fixed-variant": "#006c31",
            "secondary-fixed": "#ffddba",
            "error": "#9f403d",
            "outline": "#737c81",
            "on-surface-variant": "#586065",
            "error-container": "#fe8983",
            "inverse-primary": "#ffffff",
            "primary-dim": "#535252",
            "on-background": "#2b3438",
            "on-secondary-fixed-variant": "#835000",
            "surface-container-lowest": "#ffffff",
            "secondary-fixed-dim": "#ffcb93",
            "secondary-container": "#ffddba",
            "inverse-on-surface": "#9b9d9f",
            "on-tertiary-container": "#00612b",
            "outline-variant": "#aab3b9",
            "on-secondary-container": "#764700",
            "primary": "#5f5e5e",
            "on-tertiary-fixed": "#004c20",
            "error-dim": "#4e0309",
            "tertiary-fixed": "#7fff9d",
            "on-surface": "#2b3438",
            "tertiary": "#006e32",
            "on-secondary-fixed": "#5d3700",
            "primary-fixed-dim": "#d6d4d3",
            "surface-tint": "#5f5e5e"
         },
         fontFamily: {
            "headline": ["Satisfy", "cursive"],
            "body": ["Satisfy", "cursive"],
            "label": ["Satisfy", "cursive"]
         },
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
         },
      },
   },
   animation: {
      "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      marquee: "marquee var(--duration) linear infinite",
      "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      "shine-spin": "shine-spin var(--duration) infinite linear",
   },
   keyframes: {
      "border-beam": {
         "100%": {
            "offset-distance": "100%",
         },
      },
      marquee: {
         from: { transform: "translateX(0)" },
         to: { transform: "translateX(calc(-100% - var(--gap)))" },
      },
      "marquee-vertical": {
         from: { transform: "translateY(0)" },
         to: { transform: "translateY(calc(-100% - var(--gap)))" },
      },
      "shine-spin": {
         "0%": {
            transform: "rotate(0deg)",
         },
         "100%": {
            transform: "rotate(360deg)",
         },
      },
   },
   plugins: [],
}
