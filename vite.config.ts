import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true,
				type: 'module',
			},
			pwaAssets: {
				config: true,
			},
			workbox: {
				mode: process.env.env === 'development' ? 'development' : 'production',
			},
			manifest: {
				short_name: 'SvelteKit PWA',
				name: 'SvelteKit PWA',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: '/pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'any maskable',
					},
				],
				screenshots: [
					{
						src: '/pwa-desktop-screenshot.png',
						sizes: '1920x1080',
						type: 'image/png',
						form_factor: 'wide',
					},
					{
						src: '/pwa-mobile-screenshot.png',
						sizes: '1920x1080',
						type: 'image/png',
						form_factor: 'narrow',
					},
				],
				protocol_handlers: [],
			},
			kit: {
				includeVersionFile: true,
			},
		}),
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
