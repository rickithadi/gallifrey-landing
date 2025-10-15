/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== GALLIFREY BRAND COLORS =====
        "gallifrey-white": "rgb(var(--gallifrey-white))",
        "gallifrey-off-white": "rgb(var(--gallifrey-off-white))",
        "gallifrey-light-gray": "rgb(var(--gallifrey-light-gray))",
        "gallifrey-medium-gray": "rgb(var(--gallifrey-medium-gray))",
        "gallifrey-dark-gray": "rgb(var(--gallifrey-dark-gray))",
        "gallifrey-charcoal": "rgb(var(--gallifrey-charcoal))",
        "gallifrey-teal": "rgb(var(--gallifrey-teal))",
        "gallifrey-teal-dark": "rgb(var(--gallifrey-teal-dark))",
        "gallifrey-teal-light": "rgb(var(--gallifrey-teal-light))",
        "gallifrey-border": "rgb(var(--gallifrey-border))",

        // ===== WORKOS-INSPIRED COLORS =====
        "workos-purple": {
          400: "#a163f1",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        "workos-blue": {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
        "workos-teal": {
          400: "#40dfa3",
          500: "#14b8a6",
          600: "#0d9488",
        },

        // ===== OWN YOUR NARRATIVE CAMPAIGN COLORS =====
        "oyn-stone": {
          50: "rgb(var(--oyn-stone-50))",
          100: "rgb(var(--oyn-stone-100))",
          200: "rgb(var(--oyn-stone-200))",
          300: "rgb(var(--oyn-stone-300))",
          400: "rgb(var(--oyn-stone-400))",
          500: "rgb(var(--oyn-stone-500))",
          600: "rgb(var(--oyn-stone-600))",
          700: "rgb(var(--oyn-stone-700))",
          800: "rgb(var(--oyn-stone-800))",
          900: "rgb(var(--oyn-stone-900))",
        },
        "oyn-orange": {
          50: "rgb(var(--oyn-orange-50))",
          100: "rgb(var(--oyn-orange-100))",
          200: "rgb(var(--oyn-orange-200))",
          300: "rgb(var(--oyn-orange-300))",
          400: "rgb(var(--oyn-orange-400))",
          500: "rgb(var(--oyn-orange-500))",
          600: "rgb(var(--oyn-orange-600))",
          700: "rgb(var(--oyn-orange-700))",
          800: "rgb(var(--oyn-orange-800))",
          900: "rgb(var(--oyn-orange-900))",
        },

        // ===== SEMANTIC COLOR MAPPINGS =====
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: "rgb(var(--card))",
        "card-foreground": "rgb(var(--card-foreground))",
        popover: "rgb(var(--popover))",
        "popover-foreground": "rgb(var(--popover-foreground))",
        primary: "rgb(var(--primary))",
        "primary-foreground": "rgb(var(--primary-foreground))",
        secondary: "rgb(var(--secondary))",
        "secondary-foreground": "rgb(var(--secondary-foreground))",
        muted: "rgb(var(--muted))",
        "muted-foreground": "rgb(var(--muted-foreground))",
        accent: "rgb(var(--accent))",
        "accent-foreground": "rgb(var(--accent-foreground))",
        destructive: "rgb(var(--destructive))",
        "destructive-foreground": "rgb(var(--destructive-foreground))",
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        chart: {
          1: "rgb(var(--chart-1))",
          2: "rgb(var(--chart-2))",
          3: "rgb(var(--chart-3))",
          4: "rgb(var(--chart-4))",
          5: "rgb(var(--chart-5))",
        },

        // ===== LEGACY COLORS (for backward compatibility) =====
        "pure-white": "rgb(var(--gallifrey-white))",
        "off-white": "rgb(var(--gallifrey-off-white))",
        "light-gray": "rgb(var(--gallifrey-light-gray))",
        "medium-gray": "rgb(var(--gallifrey-medium-gray))",
        "dark-gray": "rgb(var(--gallifrey-dark-gray))",
        charcoal: "rgb(var(--gallifrey-charcoal))",
        "teal-accent": "rgb(var(--gallifrey-teal))",
        "teal-dark": "rgb(var(--gallifrey-teal-dark))",
      },
      fontFamily: {
        heading: ["Montserrat", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        body: ["Source Sans Pro", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
        logo: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "400% 400%",
            "background-position": "right center",
          },
        },
        "workos-pulse": {
          "0%, 100%": {
            "transform": "scale(1)",
            "opacity": "0.8",
          },
          "50%": {
            "transform": "scale(1.05)",
            "opacity": "1",
          },
        },
        "workos-float": {
          "0%, 100%": {
            "transform": "translateY(0px)",
          },
          "50%": {
            "transform": "translateY(-10px)",
          },
        },
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-slow": "gradient-x 8s ease infinite",
        "gradient-medium": "gradient-x 5s ease infinite",
        "gradient-fast": "gradient-x 3s ease infinite",
        "workos-pulse": "workos-pulse 3s ease-in-out infinite",
        "workos-float": "workos-float 6s ease-in-out infinite",
      },
      backgroundSize: {
        "size-200": "200% 200%",
        "size-400": "400% 400%",
      },
    },
  },
  plugins: [],
};
