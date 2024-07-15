<script>
	import TitleWithBack from '$lib/components/title-with-back.svelte'
	import { convertAddress } from '$lib/utils/addressUtil'
	import PlusIcon from 'virtual:icons/ph/plus-circle'
	export let data
	const { addresses } = data
</script>

<TitleWithBack
	title="Addresses"
	previousPage="/profile"
	previousPageDescription="Back to profile page"
/>
<main class="mx-auto flex w-full max-w-lg flex-col px-4">
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
					{convertAddress(address)}
				</p>
				<span aria-label="Coordinate">({address.coordinate.x}, {address.coordinate.y})</span>
			</li>
		{:else}
			<li>
				<p class="text-center">No address found.</p>
			</li>
		{/each}
	</ul>
</main>
