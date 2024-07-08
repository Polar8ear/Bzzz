<script lang="ts">
	import GoogleMapAutocomplete from '$lib/components/google-map-autocomplete.svelte'
	import TitleWithBack from '$lib/components/title-with-back.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import { superForm } from 'sveltekit-superforms'

	export let data

	const { form, errors, constraints, enhance, message } = superForm(data.form, {})
	let latitude: number
	let longitude: number
</script>

<TitleWithBack
	title="Create New Address"
	previousPage="/profile/addresses"
	previousPageDescription="Back to addresses page"
/>

<form
	action="?"
	method="POST"
	use:enhance
	class="mx-auto grid max-w-lg grid-cols-2 gap-3 rounded-md border border-neutral-200 px-8 py-6 shadow-md"
>
	{#if $message != null}
		<div class="col-span-2">{$message}</div>
	{/if}
	<div class="col-span-2">
		<Label for="line1-input">Line 1</Label>
		<Input
			type="text"
			placeholder="House No"
			id="line1-input"
			name="line1"
			bind:value={$form.line1}
			aria-invalid={$errors.line1 ? 'true' : undefined}
			{...$constraints.line1}
		/>
	</div>
	<div class="col-span-2">
		<Label for="line2-input">Line 2</Label>
		<Input
			type="text"
			placeholder="(Optional)"
			id="line2-input"
			name="line2"
			bind:value={$form.line2}
			aria-invalid={$errors.line2 ? 'true' : undefined}
			{...$constraints.line2}
		/>
	</div>
	<div class="col-span-2">
		<Label for="line3-input">Line 3</Label>
		<Input
			type="text"
			placeholder="(Optional)"
			id="line3-input"
			name="line3"
			bind:value={$form.line3}
			aria-invalid={$errors.line3 ? 'true' : undefined}
			{...$constraints.line3}
		/>
	</div>
	<div class="">
		<Label for="postcode-input">Postcode</Label>
		<Input
			type="text"
			placeholder="Postcode"
			id="postcode-input"
			name="postcode"
			bind:value={$form.postcode}
			aria-invalid={$errors.postcode ? 'true' : undefined}
			{...$constraints.postcode}
		/>
	</div>
	<div class="">
		<Label for="city-input">City</Label>
		<Input
			type="text"
			placeholder="city"
			id="city-input"
			name="city"
			autocomplete="city"
			bind:value={$form.city}
			aria-invalid={$errors.city ? 'true' : undefined}
			{...$constraints.city}
		/>
	</div>

	<div class="">
		<Label for="state-input">State</Label>
		<Input
			type="text"
			placeholder="State"
			id="state-input"
			name="state"
			autocomplete="state"
			bind:value={$form.state}
			aria-invalid={$errors.state ? 'true' : undefined}
			{...$constraints.state}
		/>
	</div>
	<div class="">
		<Label for="country-input">Country</Label>
		<Input
			type="text"
			placeholder="Country"
			id="country-input"
			name="country"
			autocomplete="country"
			bind:value={$form.country}
			aria-invalid={$errors.country ? 'true' : undefined}
			{...$constraints.country}
		/>
	</div>

	<div class="col-span-2">
		<GoogleMapAutocomplete bind:latitude bind:longitude />
	</div>

	<div class="">
		<label for="x"> Coordinate </label>
		<div class="flex">
			<span>(</span>
			<input
				type="text"
				name="x"
				class="w-16 text-center"
				readonly
				value={latitude?.toFixed(3) ?? 'lat'}
			/>
			<span>,</span>
			<input
				type="text"
				name="y"
				class="w-16 text-center"
				readonly
				value={longitude?.toFixed(3) ?? 'lng'}
			/>
			<span>)</span>
		</div>
	</div>
	<Button type="submit" class="col-span-2">Submit</Button>
</form>
