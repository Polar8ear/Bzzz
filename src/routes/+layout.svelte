<script lang="ts">
	import '../app.css'
	import { pwaInfo } from 'virtual:pwa-info'
	import { pwaAssetsHead } from 'virtual:pwa-assets/head'

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
	if (typeof window !== 'undefined') {
		import('../pwa')
	}
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

<div class="flex min-h-screen flex-col">
	<header class="bg-slate-300 py-6">
		<p class="ml-5 text-5xl font-bold">Bzzz</p>
	</header>

	<main class="my-2 flex-grow">
		<slot />
	</main>

	<footer class="rounded-t-lg bg-slate-800 py-6 text-center text-slate-300">
		<p class="font-bold">Bzzz Limited</p>
	</footer>
</div>

<style>
	:global(body) {
		min-height: 100vh;
	}
</style>
