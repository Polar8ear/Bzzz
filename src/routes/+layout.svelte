<script lang="ts">
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

<main>
	<div>{JSON.stringify(pwaAssetsHead)}</div>
	<slot />
</main>

<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<!-- {#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await} -->

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
