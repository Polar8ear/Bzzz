<script lang="ts">
	import { getImageUrl } from '$lib/utils/image'

	export let data
	const isLoggedIn = data.user != null
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<header class="flex w-full items-center justify-between p-4">
		<div class="text-3xl font-bold">
			<span>🛠️</span>
		</div>
		<nav>
			<ul class="flex space-x-4 text-lg">
				{#if isLoggedIn}
					<li><a href="/dashboard" class="hover:underline">Dashboard</a></li>
				{:else}
					<li><a href="/sign-up" class="hover:underline">Sign Up</a></li>
				{/if}
				<li><a href="#features" class="hover:underline">Features</a></li>
				<li><a href="#about" class="hover:underline">About</a></li>
				<li><a href="#contact" class="hover:underline">Contact</a></li>
			</ul>
		</nav>
	</header>

	<main class="flex flex-grow flex-col items-center justify-center text-center">
		<h1 class="mb-4 text-5xl font-bold">Bzzz</h1>
		<p class="mb-8 text-xl">We provide the best handyman services in the city.</p>
		<div class="flex space-x-4">
			<a
				href={isLoggedIn ? '/dashboard' : '/sign-up'}
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">Get Started</a
			>
			<a
				href="/services"
				class="rounded border border-blue-500 bg-white px-4 py-2 text-blue-500 hover:bg-blue-500 hover:text-white"
				>Request Service</a
			>
		</div>
	</main>

	<section id="services" class="py-16">
		<h2 class="mb-8 text-center text-3xl font-bold">Our Services</h2>
		<p class="mb-8 text-center text-lg">We provide a wide range of services to meet your needs.</p>
		<div class="flex justify-center space-x-8">
			{#each data.services as service}
				{#if service.image != null}
					<div
						class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-300"
					>
						<img
							src={getImageUrl(service.image)}
							alt={service.name}
							class="aspect-square w-full object-cover"
						/>
					</div>
				{/if}
			{/each}
		</div>
	</section>
</div>
