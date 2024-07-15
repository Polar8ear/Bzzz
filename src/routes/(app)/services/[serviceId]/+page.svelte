<script>
	export let data
	import Ratings from '$lib/components/ratings.svelte'
	import TitleWithBack from '$lib/components/title-with-back.svelte'
	import { getImageUrl } from '$lib/utils/image'

	const reviews = [
		{ rating: 5, comment: 'My AC runs like new after their thorough wash service!' },
		{ rating: 5, comment: 'Highly recommend for anyone wanting to improve air quality at home.' },
		{ rating: 4.5, comment: 'Saved me money on repairs by keeping my AC in top shape!' },
		{ rating: 4, comment: 'Efficient service that keeps my energy bills low.' },
		{ rating: 3.5, comment: 'Professional and reliable - my go-to for AC maintenance!' },
	]
</script>

<svelte:head>
	<title>{data.service.name ?? 'Service'}</title>
	<meta name="description" content={data.service.name ?? 'Service'} />
</svelte:head>

<TitleWithBack
	title={data.service.name ?? 'Service'}
	previousPage="/services"
	previousPageDescription="Back to search services page"
/>
<main class="flex flex-col items-center">
	<img
		src={data.service.image != null ? getImageUrl(data.service.image) : undefined}
		alt="{data.service.name} service image"
		class="aspect-video max-h-52 w-full bg-slate-400 object-cover"
	/>

	{#if data.service.details}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
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
				{#each ['Clean-up', 'Efficient', 'Professional', 'High-quality', 'Customer satisfaction'] as comment}
					<div class="rounded-md bg-gray-300 px-4 py-2">
						<span>{comment}</span>
					</div>
				{/each}
			</div>
		</div>
		<div class="mx-4 my-4 flex flex-col gap-2">
			<!-- TODO: show real reviews -->
			{#each reviews as review}
				<div class="flex gap-2">
					<img
						src=""
						alt=""
						class="aspect-square h-8 rounded-full border border-gray-200 bg-black object-cover"
					/>
					<div>
						<Ratings ratings={review.rating} />
						<p class="line-clamp-2 max-w-prose text-ellipsis">
							{review.comment}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</article>
	<div
		class="sticky bottom-14 mt-auto flex h-20 items-center justify-center self-stretch bg-slate-100 md:justify-end"
	>
		<a
			href="/services/book/{data.service.id}"
			class="mx-4 block min-w-80 rounded-lg bg-gray-300 px-2 py-3 text-center md:max-w-24"
			>Book now</a
		>
	</div>
</main>
