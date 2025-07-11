/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "#0a0a0a",
          secondary: "#111111",
          tertiary: "#1a1a1a",
        },
        foreground: {
          DEFAULT: "#ffffff",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
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
        // Neon accent colors
        "neon-cyan": "#00ffff",
        "neon-purple": "#a855f7",
        "neon-pink": "#ec4899",
        "neon-green": "#10b981",
        "neon-blue": "#3b82f6",
        // Chart colors
        "chart-1": "#00ffff",
        "chart-2": "#a855f7",
        "chart-3": "#ec4899",
        "chart-4": "#10b981",
        "chart-5": "#3b82f6",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #111111 0%, #0a0a0a 100%)",
        "gradient-card": "linear-gradient(135deg, #1a1a1a 0%, #111111 100%)",
        "gradient-neon": "linear-gradient(135deg, #00ffff20 0%, #a855f720 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,255,255,0.3)",
        "neon-purple": "0 0 20px rgba(168,85,247,0.3)",
        "neon-cyan": "0 0 20px rgba(0,255,255,0.3)",
        soft: "0 4px 20px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0,255,255,0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(0,255,255,0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
