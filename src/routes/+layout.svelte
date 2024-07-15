<script lang="ts">
	import '../app.css'
	import { pwaInfo } from 'virtual:pwa-info'
	import { pwaAssetsHead } from 'virtual:pwa-assets/head'
	import { setUser } from '$lib/stores/userStore'
	import { onMount } from 'svelte'

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register')
			registerSW({
				immediate: true,
				onRegisteredSW(url, r) {
					// uncomment following code if you want check for updates
					r &&
						setInterval(
							() => {
								console.log('Checking for sw update')
								r.update()
							},
							1000 * 60 * 60,
						)
					console.log(`SW Registered from ${url}:`, r)
				},
				onRegisterError(error) {
					console.log('SW registration error', error)
				},
			})
		}
	})

	export let data
	$: setUser(data.user)
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifest}
	{#if pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
</svelte:head>

<slot />

<style>
	:global(body) {
		min-height: 100vh;
	}
</style>
