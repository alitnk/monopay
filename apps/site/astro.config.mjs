import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://monopay.js.org',
	base: '/',
	vite: {
		ssr: {
			noExternal: ['execa', 'is-stream', 'npm-run-path'],
		},
	},
	integrations: [
		starlight({
			favicon: "public/favicon.ico",
			title: 'Monopay',
			defaultLocale: 'root',
			locales: {
				root: {
					label: "English",
					dir: 'ltr',
					lang: 'en',
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
					items: [
						{
							label: "Request Payment",
							link: "/usage/request-payment",
							translations: {
								fa: "درخواست پرداخت",
							},
						},
						{
							label: "Send User to the IPG",
							link: "/usage/send-user-to-ipg",
							translations: {
								fa: "انتقال کاربر به درگاه",
							},
						},
						{
							label: "Verify Payment",
							link: "/usage/verify-payment",
							translations: {
								fa: "تایید پرداخت",
							},
						},
						{
							label: "Catching Exceptions",
							link: "/usage/exceptions",
							translations: {
								fa: "کرفتن خطا‌ها",
							},
						}
					]
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
