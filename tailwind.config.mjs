/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// The specific green from your screenshot
				'brand-green': '#9bb066', 
				'brand-dark': '#7a8a4b',
				// The creamy background color
				'brand-bg': '#fdfbf7',
				'brand-text': '#5a5a5a',
			},
			fontFamily: {
				// We'll use a serif font for that "rustic" look
				serif: ['"Playfair Display"', 'serif'],
				sans: ['"Lato"', 'sans-serif'],
				// Cursive for special headlines
				script: ['"Great Vibes"', 'cursive'], 
			}
		},
	},
	plugins: [],
}