<script>
	export let data
	import BackIcon from 'virtual:icons/fa6-solid/chevron-left'
	import Ratings from '$lib/components/ratings.svelte'
	import TitleWithBack from '$lib/components/title-with-back.svelte'
</script>

<article class="flex min-h-screen flex-col items-center">
	<TitleWithBack
		title={data.service.name ?? 'Service'}
		previousPage="/"
		previousPageDescription="Back to search services page"
	/>
	<img
		src={data.service.image?.key ??
			'https://png.pngtree.com/png-clipart/20220603/original/pngtree-workplace-word-concepts-banner-png-image_7904754.png'}
		alt="{data.service.name} service image"
		class="max-h-52 w-full bg-slate-400 object-cover"
	/>

	{#if data.service.details}
		<div class="prose prose-slate m-4 self-center">{@html data.service.details}</div>
	{:else}
		<p class="my-4 text-center">No details</p>
	{/if}

	<article class="relative">
		<div class="mx-4 flex gap-4">
			<div class="flex flex-col items-center justify-center font-medium">
				<h1>Reviews</h1>
				<div class="flex flex-col items-center">
					<span class="text-lg">4.7</span>
					<Ratings ratings={4.7} />
					<span class="text-sm">(22)</span>
				</div>
			</div>
			<div class="flex flex-wrap items-start gap-2">
				{#each Array(5) as _, i}
					<div class="rounded-md bg-gray-300 px-4 py-2">
						<span>{'a'.repeat(((i + 6) % 5) ** Math.random() * 6)}</span>
					</div>
				{/each}
			</div>
		</div>
		<div class="mx-4 my-4 flex flex-col gap-2">
			<!-- TODO: show real reviews -->
			{#each Array(4) as _, i}
				<div class="flex gap-2">
					<img
						src=""
						alt=""
						class="aspect-square h-8 rounded-full border border-gray-200 bg-black object-cover"
					/>
					<div>
						<Ratings ratings={5} />
						<p class="line-clamp-2 max-w-prose text-ellipsis">
							It was a very pleasant experience. Professionals arrive on time and fix is a breeze.
						</p>
					</div>
				</div>
			{/each}
		</div>
	</article>
	<div
		class="sticky bottom-14 mt-auto flex h-20 items-center justify-center self-stretch bg-slate-100 md:justify-end lg:bottom-0"
	>
		<a
			href="/services/book/{data.service.id}"
			class="mx-4 block min-w-80 rounded-lg bg-gray-300 px-2 py-3 text-center md:max-w-24"
			>Book now</a
		>
	</div>
</article>
