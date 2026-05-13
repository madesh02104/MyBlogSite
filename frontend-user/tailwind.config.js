/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-strong": "var(--color-surface-strong)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)",
        "accent-soft": "var(--color-accent-soft)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui"],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: "var(--color-text)",
            a: {
              color: "var(--color-accent)",
              textDecoration: "none",
            },
            h1: { color: "var(--color-text)" },
            h2: { color: "var(--color-text)" },
            h3: { color: "var(--color-text)" },
            h4: { color: "var(--color-text)" },
            strong: { color: "var(--color-text)" },
            code: { color: "var(--color-accent)" },
            blockquote: {
              borderLeftColor: "var(--color-border)",
              color: "var(--color-muted)",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
