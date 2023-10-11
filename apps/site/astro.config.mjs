import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://monopay.js.org',
	base: '/',
	redirects: {
		'/': '/en'
	},
	vite: {
		ssr: {
			noExternal: ['execa', 'is-stream', 'npm-run-path'],
		},
	},
	integrations: [
		starlight({
			title: 'Monopay',
			defaultLocale: 'en',
			locales: {
				en: {
					label: "English",
					dir: 'ltr',
				},
				fa: {
					label: "فارسی",
					dir: "rtl",
				},
			},
			social: {
				github: 'https://github.com/alitnk/monopay',
			},
			customCss: [
				'@fontsource/vazirmatn/400.css',
				'@fontsource/vazirmatn/600.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: "Getting Started",
					translations: {
						fa: "شروع"
					},
					collapsed: false,
					items: [
						{
							label: 'Introduction',
							translations: {
								fa: "معرفی"
							},
							link: "/introduction",
						},
						{
							label: 'Installation',
							translations: {
								fa: "نحوه نصب"
							},
							link: "/installation",
						},
						{
							label: 'Payment Procedure',
							translations: {
								fa: "روند پرداخت"
							},
							link: "/payment-procedure",
						},
					]
				},
				{
					label: 'Supported Drivers',
					translations: {
						fa: "درایور‌ها"
					},
					link: "/drivers",

				},
				{
					label: "Usage",
					translations: {
						fa: "نحوه استفاده",
					},
					autogenerate: { directory: "usage" },
					// items: [
					// 	{
					// 		label: "Request Payment",
					// 		link: "/usage/request-payment",
					// 		translations: {
					// 			fa: "درخواست پرداخت",
					// 		},
					// 	},
					// 	{
					// 		label: "Send User to the IPG",
					// 		link: "/usage/send-user-to-ipg",
					// 		translations: {
					// 			fa: "انتقال کاربر به درگاه",
					// 		},
					// 	},
					// 	{
					// 		label: "Verify Payment",
					// 		link: "/usage/verify-payment",
					// 		translations: {
					// 			fa: "تایید پرداخت",
					// 		},
					// 	}
					// ]
				},
				{
					label: "Advanced",
					translations: {
						fa: "پیشرفته",
					},
					items: [
						{
							label: "Configuration",
							link: "/configuration",
							translations: {
								fa: "تنظیمات",
							},
						},
					]
				}
			]
		}),
	],
});
