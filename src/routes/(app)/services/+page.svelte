<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import { superForm } from 'sveltekit-superforms'
	import { debounce } from '$lib/utils/debounce'
	import { goto } from '$app/navigation'
	import MagnifyingGlassIcon from 'virtual:icons/ph/magnifying-glass-bold'
	import { getImageUrl } from '$lib/utils/image.js'
	export let data
	$: services = data.services
	const { form, errors, constraints } = superForm(data.form, {
		resetForm: false,
	})

	let searchInput: HTMLInputElement

	const handleInput = debounce(async () => {
		await goto(`?q=${$form.q}`, {
			keepFocus: true,
		})
	}, 300)
</script>

<form method="GET">
	<div class="relative mx-4">
		<label for="search-input" class="absolute inset-y-0 left-2 flex items-center">
			<MagnifyingGlassIcon />
		</label>
		<Input
			bind:value={$form.q}
			on:input={handleInput}
			id="search-input"
			inputEl={searchInput}
			class="pl-8"
			name="q"
			type="text"
			aria-invalid={$errors.q ? 'true' : undefined}
			placeholder="Search for services"
			{...$constraints.q}
		/>
	</div>
</form>
<article class="mx-4 divide-y divide-gray-300">
	{#each services ?? [] as service (service.id)}
		<a href="services/{service.id}" class="m-2 flex h-16 items-center gap-2.5 hover:opacity-80">
			<img
				src={service.image != null ? getImageUrl(service.image) : undefined}
				alt="{service.name} Image"
				class="aspect-square h-12 rounded-full border border-gray-200 object-scale-down"
				height="48"
			/>
			<span>{service.name}</span>
		</a>
	{:else}
		<div class="mx-2 text-center py-8">No services found</div>
	{/each}
</article>
