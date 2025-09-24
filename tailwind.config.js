/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	safelist: [
		{
			pattern:
				/bg-(primary|custom-blue|custom-yellow|custom-violet|custom-green|custom-dark-green|custom-pink|custom-orange|custom-purple)/,
			variants: ["hover"],
		},
	],
	theme: {
		extend: {
			colors: {
				"light-white": "rgba(255,255,255,0.18)",
				primary: "#7163B7",
				secondary: "#316FE8",
				"primary-variant": "#EBEBF3",
				"secondary-variant": "#326FEA",
				"custom-blue": "#024CAA",
				"custom-yellow": "#7D8D52",
				"custom-violet": "#6E30CF",
				"custom-green": "#04A6C6",
				"custom-dark-blue": "#316FE8",
				"custom-dark-green": "#227B94",
				"custom-pink": "#E75480",
				"custom-orange": "#9D4EDD",
				"custom-purple": "#CEA2FD",

			},
			container: {
				center: true,
				padding: {
					DEFAULT: "1rem",
					sm: "2rem",
					lg: "4rem",
					xl: "5rem",
					"2xl": "6rem",
				},
			},
			keyframes: {
				'3d-spin': {
					'0%': { transform: 'rotateY(0deg)' },
					'50%': { transform: 'rotateY(180deg) scale(1.1)' },
					'100%': { transform: 'rotateY(360deg)' },
				},

				

				logoReveal: {
          "0%": { opacity: "0", transform: "translateY(30px) scale(0.95)" },
          "50%": { opacity: "0.7", transform: "translateY(-5px) scale(1.05)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
			},
			animation: {
				'3d-spin': '3d-spin 6s linear infinite',
		
				logoReveal: "logoReveal 1s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
