<script>
	import TitleWithBack from '$lib/components/title-with-back.svelte'
	import PlusIcon from 'virtual:icons/ph/plus-circle'
	export let data
	const { addresses } = data
</script>

<TitleWithBack
	title="Addresses"
	previousPage="/profile"
	previousPageDescription="Back to profile page"
/>
<article class="mx-auto flex min-h-screen max-w-md flex-col px-4">
	<div class="my-2 flex items-center justify-between">
		<span class="opacity-50">{addresses.length} addresses</span>
		<a href="/profile/addresses/new"
			><span class="sr-only">Create New</span><PlusIcon width="2rem" height="2rem" /></a
		>
	</div>
	<ul class=" flex flex-col items-stretch gap-4 divide-y">
		{#each addresses as address}
			<li class="flex flex-col gap-2 rounded-sm bg-slate-100 p-4">
				<p aria-label="Address">
					{address.line1},
					{address.line2 != null ? `${address.line2}, ` : ''}
					{address.line3 != null ? `${address.line3}, ` : ''}
					{address.postcode}
					{address.city}, {address.state}
				</p>
				<span aria-label="Coordinate">({address.coordinate.x}, {address.coordinate.y})</span>
			</li>
		{:else}
			<li>
				<p class="text-center">No address found.</p>
			</li>
		{/each}
	</ul>
</article>
