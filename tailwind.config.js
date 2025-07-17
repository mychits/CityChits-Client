/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	safelist: [
		{
			pattern:
				/bg-(primary|custom-blue|custom-yellow|custom-violet|custom-green|custom-dark-green)/,
			variants: ["hover"], // Essential for hover states
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
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
