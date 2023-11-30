/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'map-bg': '#87f0ff',
				brand: '#d26060ff'
			},
			gridTemplateColumns: {
				app: '1fr 2fr',
				'route-list': 'max-content auto auto'
			},
			gridTemplateRows: {
				shell: 'min-content 1fr'
			},
			dropShadow: {
				logo: '0 0 2px rgba(0,0.2,0.4,0.2)'
			}
		}
	},

	plugins: []
};

module.exports = config;
