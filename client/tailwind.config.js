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
				lavender: {
					'100': '#F0D6F6',
					'200': '#B27BC9',
					'300': '#7A4C93',
					'400': '#381B4C',
					'500': '#210D36',
					'600': '#17082C',
					'700': '#100524'
				},
				ash: {
					'100': '#F5F3F0',
					'200': '#E8E4DC',
					'300': '#DBD4C9',
					'400': '#CEC4B6',
					'500': '#8F877C',
					'600': '#4F4A43',
					'700': '#0F0D0A'
				},
				reflexBlue: {
					'100': '#E5EEFF',
					'200': '#98ADD5',
					'300': '#4C6CAA',
					'400': '#002B7F',
					'500': '#00205E',
					'600': '#00143C',
					'700': '#00081A'
				},
				faintingLight: {
					'100': '#EEF4F6',
					'200': '#E0EAEE',
					'300': '#D3E1E7',
					'400': '#C6D8E0',
					'500': '#87949B',
					'600': '#485156',
					'700': '#090E11'
				},
				customNeutral: {
					'100': '#F2F2F2',
					'200': '#AAAAAA',
					'300': '#626262',
					'400': '#1A1A1A',
					'500': '#151515',
					'600': '#111111',
					'700': '#0D0D0D'
				},
				success: {
					'100': '#EDF7EE',
					'200': '#B8DFBA',
					'300': '#82C785',
					'400': '#4CAF50',
					'500': '#367A38',
					'600': '#1F4620',
					'700': '#081208'
				},
				warning: {
					'100': '#F8C286',
					'200': '#F6AE5D',
					'300': '#F49A35',
					'400': '#C37B2A',
					'500': '#925C20',
					'600': '#5C1D16',
					'700': '#180E01'
				},
				error: {
					'100': '#FCEAE8',
					'200': '#F5B6AE',
					'300': '#EE8175',
					'400': '#E74C3C',
					'500': '#A13529',
					'600': '#5C1D16',
					'700': '#170503'
				},
				sidebar: {
					DEFAULT: 'var(--sidebar-background)',
					foreground: 'var(--sidebar-foreground)',
					primary: 'var(--sidebar-primary)',
					'primary-foreground': 'var(--sidebar-primary-foreground)',
					accent: 'var(--sidebar-accent)',
					'accent-foreground': 'var(--sidebar-accent-foreground)',
					border: 'var(--sidebar-border)',
					ring: 'var(--sidebar-ring)'
				}
			},
			boxShadow: {
				custom: '0px 0px 1px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px -0.5px rgba(0, 0, 0, 0.06), 0px 3px 3px -1.5px rgba(0, 0, 0, 0.06), 0px 6px 6px -3px rgba(0, 0, 0, 0.25), 0px 12px 12px -6px rgba(0, 0, 0, 0.06), 0px 24px 24px -12px rgba(0, 0, 0, 0.06)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},

			gridTemplateRows: {
				auto_repeat: 'repeat(96, 1fr)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate")
	]

}


