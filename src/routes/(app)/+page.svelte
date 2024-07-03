<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import { log } from '$lib/log.js'
	import { superForm } from 'sveltekit-superforms'

	export let data
	$: services = data.services
	const { enhance, form, errors, constraints } = superForm(data.form, {})
</script>

<form method="GET">
	<Input
		bind:value={$form.q}
		name="q"
		type="text"
		aria-invalid={$errors.q ? 'true' : undefined}
		placeholder="Search for services"
		{...$constraints.q}
	/>
</form>
{#each services ?? [] as service (service.id)}
	<div>
		{service.name}
	</div>
{:else}
	<div>No services found</div>
{/each}
