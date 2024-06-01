<script lang="ts">
	import NavBar from '$lib/components/nav-bar.svelte'
</script>

<div class="flex min-h-screen flex-col">
	<header class="bg-slate-100 py-6">
		<p class="ml-5 text-center text-2xl font-bold">Bzzz</p>
	</header>

	<main class="my-2 flex-grow">
		<slot />
		<NavBar />
	</main>

	<footer class="rounded-t-lg bg-slate-800 pb-16 pt-6 text-center text-slate-300 lg:pb-6">
		<p class="font-bold">Bzzz Limited</p>
	</footer>
</div>
