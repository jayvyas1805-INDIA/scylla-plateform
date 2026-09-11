export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Matches Client/src/styles/landing-theme.css so the
        // admin panel uses the exact same palette as the landing page.
        "admin-bg": "#0b0f1a",
        "admin-surface": "#12182a",
        "admin-surface-raised": "#161d33",
        "admin-border": "#232b45",
        "admin-border-strong": "#313c5e",
        "admin-text": "#f4f6fb",
        "admin-muted": "#9aa3bd",
        "admin-accent": "#0080ff",
        "admin-accent-dark": "#0060e0",
      },
      keyframes: {
        neonPulseBlue: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
            boxShadow: "0 0 10px rgba(0,128,255,0.6)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
            boxShadow: "0 0 25px rgba(0,128,255,0.9)",
          },
        },
        neonPulsePink: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
            boxShadow: "0 0 10px rgba(236,72,153,0.6)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
            boxShadow: "0 0 25px rgba(236,72,153,0.9)",
          },
        },
        neonPulseYellow: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
            boxShadow: "0 0 10px rgba(250,204,21,0.6)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
            boxShadow: "0 0 25px rgba(250,204,21,0.9)",
          },
        },
        neonPulseGreen: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
            boxShadow: "0 0 10px rgba(34,197,94,0.6)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
            boxShadow: "0 0 25px rgba(34,197,94,0.9)",
          },
        },
      },
      animation: {
        neonPulseBlue: "neonPulseBlue 3s ease-in-out infinite",
        neonPulsePink: "neonPulsePink 3s ease-in-out infinite",
        neonPulseYellow: "neonPulseYellow 3s ease-in-out infinite",
        neonPulseGreen: "neonPulseGreen 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
