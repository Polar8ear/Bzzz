<script lang="ts">
	import NavBar from './components/nav-bar.svelte'
	export let data
	const isLoggedIn = data.user != null
</script>

<div class="flex min-h-screen flex-col">
	<header class="mb-2 bg-slate-100 py-6">
		<p class="ml-5 text-center text-2xl font-bold">Bzzz</p>
	</header>

	<slot />

	<footer class="mt-auto rounded-t-lg bg-slate-800 py-6 text-center text-slate-300 lg:pb-6">
		<p class="font-bold">Bzzz Limited</p>
	</footer>
	<NavBar {isLoggedIn} />
</div>
