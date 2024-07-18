<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import { onNavigate } from '$app/navigation'
	import MagnifyingGlassIcon from 'virtual:icons/ph/magnifying-glass-bold'
	import { browser } from '$app/environment'
	import { getStatusFromRequest } from '$lib/utils/requestUtil'

	export let data

	onNavigate((navigation) => {
		if (!document.startViewTransition) return

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	})

	const dateFormatter = Intl.DateTimeFormat(browser ? navigator.language : 'en-US', {
		dateStyle: 'medium',
		timeStyle: 'short',
	})
</script>

<h1 class="sr-only">Dashboard</h1>
<div
	class="flex h-52 w-full items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-500 px-2 py-4 text-slate-100"
>
	<p class="my-auto text-3xl font-bold">Get Started With Bzzz</p>
</div>
<form method="GET" action="/services?" class="-mt-6 [view-transition-name:search]">
	<div class="relative mx-4">
		<label for="search-input" class="absolute inset-y-0 left-2 flex items-center">
			<MagnifyingGlassIcon />
		</label>
		<Input id="search-input" class="pl-8" name="q" type="text" placeholder="Search for services" />
	</div>
</form>

<main>
	{#if data.requests != null && data.requests.length > 0}
		<ul class="mx-auto flex max-w-lg flex-col flex-wrap items-stretch gap-4 p-4">
			{#each data.requests as request}
				<li class="flex flex-col gap-2 rounded-sm p-4 shadow-sm shadow-slate-500">
					<a href={`/requests/${request.id}`}>
						<h2 class="text-lg font-semibold">
							{request.service.name}
						</h2>
						<span class="opacity-80" aria-label="starting at"
							>{dateFormatter.format(request.startedAt)}</span
						>
						<span aria-label="status">{getStatusFromRequest(request)}</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="my-4 text-center text-xl opacity-80">No request found. Make one now :D</p>
	{/if}
</main>
