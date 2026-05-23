export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        neonPulseBlue: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
            boxShadow: "0 0 10px rgba(59,130,246,0.6)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
            boxShadow: "0 0 25px rgba(59,130,246,0.9)",
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
