<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import Input from '$lib/components/ui/input/input.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import { superForm } from 'sveltekit-superforms'
	import { UploadButton } from '@uploadthing/svelte'
	import { createUploader } from '$lib/utils/uploadthing.js'
	import ErrorMessage from '$lib/components/error-message.svelte'

	export let data
	let url: string
	const uploader = createUploader('imageUploader', {
		onClientUploadComplete: (res) => {
			const fileId = res[0]?.serverData?.fileId
			url = res[0]?.url

			if (fileId == null) {
				console.error('No file ID found')
				return
			}

			$form.imageFileId = fileId
		},
		onUploadError: (error: Error) => {
			console.error(error)
		},
	})

	const { form, enhance, constraints, errors } = superForm(data.form, {})
</script>

<div class="mx-auto max-w-lg px-4">
	<form method="POST" class="flex flex-col gap-4" use:enhance>
		<h2 class="mt-4 text-2xl font-bold">Create Service Form</h2>
		<div class="flex flex-col gap-1">
			<Label for="name">Name</Label>
			<Input
				bind:value={$form.name}
				id="name"
				placeholder="Name"
				name="name"
				aria-errormessage={$errors.name ? 'name-error' : undefined}
				{...$constraints.name}
			/>
			<ErrorMessage errors={$errors.name} name="name" />
		</div>
		<div class="flex flex-col gap-1">
			<Label for="price">Price</Label>
			<Input
				bind:value={$form.price}
				id="price"
				type="number"
				placeholder="Price"
				name="price"
				step="0.01"
				aria-errormessage={$errors.price ? 'price-error' : undefined}
				{...$constraints.price}
			/>
			<ErrorMessage errors={$errors.price} name="price" />
		</div>
		<div class="flex flex-col gap-1">
			<Label for="details">Details</Label>
			<Input
				bind:value={$form.details}
				id="details"
				placeholder="Details"
				name="details"
				aria-errormessage={$errors.details ? 'details-error' : undefined}
				{...$constraints.details}
			/>
			<ErrorMessage errors={$errors.details} name="details" />
		</div>

		<div class="flex flex-col gap-1">
			<Label for="category">Category</Label>
			<select
				name="categoryId"
				id="category"
				bind:value={$form.categoryId}
				class="h-10 rounded-sm border bg-white"
			>
				{#each data.categories as category}
					<option value={category.id} selected={category.id === $form.categoryId}
						>{category.name}
					</option>
				{:else}
					<option value="" disabled selected>No category are present</option>
				{/each}
			</select>
		</div>
		<div class="">
			<Label>Service Image</Label>
			<input type="text" name="imageFileId" bind:value={$form.imageFileId} class="hidden" />
			<div class="rounded-md bg-blue-400 text-black">
				<UploadButton {uploader} />
			</div>
			{#if url}
				<span>Preview</span>
				<img
					src={url}
					alt="{$form.name} related image"
					class="aspect-square h-12 rounded-full border border-gray-200 object-scale-down"
				/>
			{/if}
		</div>

		<Button type="submit">Submit</Button>
	</form>
	<section>
		<h2 class="mt-4 text-2xl font-bold">Services</h2>
		<ul class="my-2 flex flex-col gap-4">
			{#each data.services as service}
				<li>
					<article class="rounded-md bg-zinc-200 px-4 py-2">
						<h2>{service.name}</h2>
						<p>Created at: {service.createdAt}</p>
						<p>Updated at: {service.updatedAt}</p>
						<p>Price: RM {(service.price / 100).toFixed(2)}</p>
					</article>
				</li>
			{/each}
		</ul>
	</section>
</div>
