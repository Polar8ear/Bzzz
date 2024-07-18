<script lang="ts">
	import TitleWithBack from '$lib/components/title-with-back.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { createUploader, createUploadThing } from '$lib/utils/uploadthing.js'
	import PlusIcon from 'virtual:icons/ph/plus-circle'
	import SpinnerIcon from 'virtual:icons/ph/spinner-gap'
	import { convertAddress } from '$lib/utils/addressUtil.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import { dateProxy, superForm } from 'sveltekit-superforms'
	import ErrorMessage from '$lib/components/error-message.svelte'
	import { onMount } from 'svelte'
	import { UploadDropzone } from '@uploadthing/svelte'

	export let data

	const { form, constraints, errors, enhance, message } = superForm(data.form, {
		resetForm: false,

		onSubmit: async ({ formData }) => {
			const startAt = formData.get('startAt')
			if (startAt == null) throw new Error('Start At is missing')

			const endAt = formData.get('endAt')
			if (endAt == null) throw new Error('End At is missing')

			const utcStartAt = new Date(startAt.toString()).toISOString()
			const utcEndAt = new Date(endAt.toString()).toISOString()

			formData.set('startAt', utcStartAt)
			formData.set('endAt', utcEndAt)

			return data
		},
	})

	let proxiedStartAt

	let proxiedEndAt

	onMount(() => {
		proxiedStartAt = dateProxy(form, 'startAt', {
			format: 'datetime-local',
		})

		proxiedEndAt = dateProxy(form, 'endAt', {
			format: 'datetime-local',
		})
	})

	const { service } = data
	const SERVICE_CHARGE_RATE = 0.1

	$: totalPrice = service.price * $form.unitCount
	$: serviceCharge = totalPrice * SERVICE_CHARGE_RATE
	$: totalPriceWithCharge = totalPrice + serviceCharge

	if ($form.imageFileIds.length !== $form.imageKeys.length) {
		throw new Error('Image file ids and keys are not in sync')
	}

	$: images = $form.imageFileIds.map((fileId, index) => {
		const key = $form.imageKeys[index]
		return {
			key,
			fileId,
			url: `https://utfs.io/f/${key}`,
		}
	})

	const { startUpload, isUploading } = createUploadThing('serviceImageUploader', {
		onClientUploadComplete: (res) => {
			$form.imageFileIds = [
				...$form.imageFileIds,
				...res.map((file) => {
					if (file.serverData == null) throw new Error('Upload Thing Server data is missing')
					return file.serverData?.fileId
				}),
			]
			$form.imageKeys = [...$form.imageKeys, ...res.map((file) => file.key)]
		},
		onUploadError: (error: Error) => {
			alert(error)
		},
	})

	const uploader = createUploader('serviceImageUploader', {
		onClientUploadComplete: (res) => {
			$form.imageFileIds = [
				...$form.imageFileIds,
				...res.map((file) => {
					if (file.serverData == null) throw new Error('Upload Thing Server data is missing')
					return file.serverData?.fileId
				}),
			]
			$form.imageKeys = [...$form.imageKeys, ...res.map((file) => file.key)]
		},
		onUploadError: (error: Error) => {
			alert(error)
		},
	})

	let page = 1
</script>

<svelte:head>
	<title>Book {data.service.name ?? 'Service'}</title>
	<meta name="description" content="Book {data.service.name ?? 'Service'}" />
</svelte:head>
<TitleWithBack
	title={data.service.name ?? 'Service'}
	previousPage={page === 1 ? `/services/${service.id}` : () => (page = 1)}
	previousPageDescription="Back to {service.name} details page"
/>
<form action="?" method="POST" class="flex flex-grow flex-col" use:enhance>
	{#if $message != null}
		<p class="">{JSON.stringify($message)}</p>
	{/if}
	<div class={page !== 1 ? 'hidden' : 'contents'}>
		<div class="mx-auto w-full max-w-prose px-4">
			<h2 class="text-sm text-slate-500">What services do you need</h2>
			<div class="flex items-baseline justify-between">
				<span>{service.name}</span>
				<div class="flex items-center gap-4">
					<Button
						disabled={$form.unitCount === 1}
						class="bg-slate-100 p-2 text-slate-500"
						on:click={() => ($form.unitCount = Math.max(1, $form.unitCount - 1))}
					>
						-
					</Button>
					<span>{$form.unitCount}</span>
					<input type="number" bind:value={$form.unitCount} name="unitCount" class="hidden" />
					<Button
						class="bg-slate-100 p-2 text-slate-500"
						on:click={() => ($form.unitCount = Math.max(1, $form.unitCount + 1))}
					>
						+
					</Button>
				</div>
			</div>
			<h2 class="text-sm text-slate-500">Upload Photos</h2>
			<div class="my-2 flex flex-wrap gap-x-4 gap-y-2">
				{#each images as image, index}
					<div>
						<img
							src={image.url}
							alt="Request image {index + 1}"
							class="aspect-square h-32 rounded-md object-cover"
							height="128"
						/>
						<input type="text" class="hidden" name="image[{index}]" value={image.fileId} />
					</div>
				{/each}
				<div class="aspect-square h-32 rounded-md border border-slate-300 text-slate-500">
					<label
						for="images-input"
						class="grid h-full w-full place-content-center text-4xl hover:opacity-70"
					>
						{#if $isUploading}
							<SpinnerIcon class="animate-spin" />
						{:else}
							<PlusIcon />
						{/if}
					</label>
					<input
						multiple
						accept="image/*"
						id="images-input"
						type="file"
						disabled={$isUploading}
						class="hidden"
						on:change={async (e) => {
							const files = e.currentTarget.files
							if (!files || files.length <= 0) return
							await startUpload(Array.from(files))
						}}
					/>
				</div>
				<UploadDropzone {uploader} />
			</div>
			<h2 class="text-sm text-slate-500">Tell us more about the issue (optional)</h2>
			<textarea
				name="details"
				id="details-input"
				rows="10"
				class="w-full bg-gray-100 p-2"
				bind:value={$form.details}
				aria-invalid={$errors.details != null ? 'true' : 'false'}
				{...$constraints.details}
			/>
			<ErrorMessage name="details" errors={$errors.details} />
		</div>
		<div
			class="sticky bottom-14 mt-auto flex flex-col gap-6 rounded-t-lg bg-slate-100 px-4 py-5 md:flex-row"
		>
			<div class="flex items-baseline justify-between gap-2 sm:justify-end">
				<span class="text-sm text-slate-600">Total</span>
				<span class="text-2xl" aria-label="Total Price">RM {(totalPrice / 100).toFixed(2)}</span>
			</div>
			<Button
				size="lg"
				variant="default"
				class="sm:ml-auto sm:min-w-32"
				type="button"
				on:click={() => (page = 2)}>Next</Button
			>
		</div>
	</div>

	<div class={page !== 2 ? 'hidden' : 'contents'}>
		<div class="mx-auto w-full max-w-prose px-4">
			<h2 class="text-sm text-slate-500">Address</h2>
			<select
				id="address-select"
				name="addressId"
				class=" h-12 w-full text-ellipsis border border-slate-300 px-2"
				bind:value={$form.addressId}
				{...$constraints.addressId}
			>
				{#each data.addresses as address}
					<option
						value={address.id}
						label={convertAddress(address)}
						selected={$form.addressId === address.id}
					/>
				{/each}
			</select>

			<h2 class="text-sm text-slate-500">Appointment Time</h2>
			<div class="flex flex-col items-stretch gap-2">
				<Label id="start-at-input">Start At</Label>
				<input
					type="datetime-local"
					name="startAt"
					id="start-at-input"
					class="h-12 w-full border border-slate-300 px-2"
					bind:value={$proxiedStartAt}
					aria-errormessage={$errors.startAt != null ? 'start-at-error' : undefined}
					aria-invalid={$errors.startAt != null ? 'true' : 'false'}
					{...$constraints.startAt}
				/>
				<ErrorMessage name="start-at" errors={$errors.startAt} />
				<Label id="end-at-input">End At</Label>
				<input
					type="datetime-local"
					name="endAt"
					id="end-at-input"
					class="h-12 w-full border border-slate-300 px-2"
					bind:value={$proxiedEndAt}
					aria-errormessage={$errors.endAt != null ? 'end-at-error' : undefined}
					aria-invalid={$errors.endAt != null ? 'true' : 'false'}
					{...$constraints.endAt}
				/>
				<ErrorMessage name="end-at" errors={$errors.endAt} />
			</div>
			<h2 class="text-sm text-slate-500">Request Summary</h2>
			<div class="flex items-baseline justify-between">
				<span>{service.name}</span>
				<div class="flex items-center gap-4">
					<span>{$form.unitCount}</span>
				</div>
			</div>
			<h2 class="text-sm text-slate-500">Price Details</h2>
			<div class="flex items-baseline justify-between">
				<span>Platform Fee</span>
				<span>RM {(serviceCharge / 100).toFixed(2)}</span>
			</div>
			<div class="flex items-baseline justify-between">
				<span>Service Fee</span>
				<span>RM {(totalPrice / 100).toFixed(2)}</span>
			</div>
		</div>
		<div
			class="sticky bottom-14 mt-auto flex flex-col gap-6 rounded-t-lg bg-slate-100 px-4 py-5 md:flex-row"
		>
			<div class="flex items-baseline justify-between gap-2 sm:justify-end">
				<span class="text-sm text-slate-600">Total</span>
				<span class="text-2xl" aria-label="Total Price"
					>RM {(totalPriceWithCharge / 100).toFixed(2)}</span
				>
			</div>
			<Button size="lg" class="sm:ml-auto sm:min-w-32" variant="default" type="submit">Pay</Button>
		</div>
	</div>
</form>
