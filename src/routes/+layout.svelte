<script lang="ts">
	import '../app.css'
	import '@uploadthing/svelte/styles.css'
	import { pwaInfo } from 'virtual:pwa-info'
	import { pwaAssetsHead } from 'virtual:pwa-assets/head'
	import { setUser } from '$lib/stores/userStore'

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
	if (typeof window !== 'undefined') {
		import('../pwa')
	}
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
