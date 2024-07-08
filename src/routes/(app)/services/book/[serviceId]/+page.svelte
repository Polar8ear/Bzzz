<script lang="ts">
	import TitleWithBack from '$lib/components/title-with-back.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { createUploader } from '$lib/utils/uploadthing.js'
	import { UploadButton } from '@uploadthing/svelte'

	export let data
	const { service } = data
	const SERVICE_CHARGE = 2000

	$: unitCount = 1
	$: totalPrice = service.price * unitCount
	$: totalPriceWithCharge = totalPrice + SERVICE_CHARGE

	type Image = {
		key: string
		url: string
		fileId: string
	}
	let images: Image[] = [
		{
			key: 'b3d30e50-69c0-458c-a978-b2436f48a0b6-xsvdpx.png',
			url: 'https://utfs.io/f/b3d30e50-69c0-458c-a978-b2436f48a0b6-xsvdpx.png',
			fileId: '01J28C646E1PTCAVJCXMTTNSVR',
		},
		{
			key: 'e2171bc5-3982-42ce-9f29-2c8bf7ceb960-cf2fvo.png',
			url: 'https://utfs.io/f/e2171bc5-3982-42ce-9f29-2c8bf7ceb960-cf2fvo.png',
			fileId: '01J28C6495HHAMJEFM0C9V53SD',
		},
		{
			key: 'f087bc37-0b29-4ee6-930c-32ab75f2c817-v31iae.png',
			url: 'https://utfs.io/f/f087bc37-0b29-4ee6-930c-32ab75f2c817-v31iae.png',
			fileId: '01J28C64D4D9ZPX36V6EMFE0V1',
		},
		{
			key: '8387c1d2-d19f-4bc1-9327-fa8f9b3d3ecd-fuxc1g.png',
			url: 'https://utfs.io/f/8387c1d2-d19f-4bc1-9327-fa8f9b3d3ecd-fuxc1g.png',
			fileId: '01J28C64J9H16CRM3G6J1TYRN7',
		},
		{
			key: '0cc0489f-aef6-43fb-81a4-7df53b27b8ec-ciol5i.png',
			url: 'https://utfs.io/f/0cc0489f-aef6-43fb-81a4-7df53b27b8ec-ciol5i.png',
			fileId: '01J28C65J6Z8NFWNRDW7FVY6DN',
		},
	]

	const uploader = createUploader('serviceImageUploader', {
		onClientUploadComplete: (res) => {
			images = [
				...images,
				...res.map((file) => {
					if (file.serverData == null) {
						throw new Error('Server data is missing')
					}

					return { key: file.key, url: file.url, fileId: file.serverData?.fileId }
				}),
			]
		},
		onUploadError: (error: Error) => {
			alert(error)
		},
	})

	let page = 2
</script>

<TitleWithBack
	title={data.service.name ?? 'Service'}
	previousPage={page === 1 ? `/services/${service.id}` : () => (page = 1)}
	previousPageDescription="Back to {service.name} details page"
/>

<form action="?pay" method="POST" class="flex min-h-screen flex-col">
	<div class={page !== 1 ? 'hidden' : 'contents'}>
		<div class="mx-auto w-full max-w-prose">
			<h2 class="text-sm text-slate-500">What services do you need</h2>
			<div class="flex items-baseline justify-between">
				<span>{service.name}</span>
				<div class="flex items-center gap-4">
					<Button
						disabled={unitCount === 1}
						class="bg-slate-100 p-2 text-slate-500"
						on:click={() => (unitCount = Math.max(1, unitCount - 1))}
					>
						-
					</Button>
					<span>{unitCount}</span>
					<Button
						class="bg-slate-100 p-2 text-slate-500"
						on:click={() => (unitCount = Math.max(1, unitCount + 1))}
					>
						+
					</Button>
				</div>
			</div>
			<h2 class="text-sm text-slate-500">Upload Photos</h2>
			<div class="flex flex-wrap gap-2">
				{#each images as image, index}
					<div>
						<img
							src={image.url}
							alt="Request image {index + 1}"
							class="aspect-square h-32 rounded-md object-cover"
						/>
						<input type="text" class="hidden" name="image[{index}]" value={image.fileId} />
					</div>
				{/each}
				<UploadButton {uploader} />
			</div>
			<h2 class="text-sm text-slate-500">Tell us more about the issue (optional)</h2>
			<textarea name="details" id="details-input" rows="10" class="w-full bg-gray-100 p-2"
			></textarea>
		</div>
		<div
			class="sticky bottom-14 mt-auto flex flex-col gap-6 rounded-t-lg bg-slate-100 px-4 py-5 lg:bottom-0"
		>
			<div class="flex items-baseline justify-between">
				<span class="text-sm text-slate-600">Total</span>
				<span class="text-2xl" aria-label="Total Price">RM {(totalPrice / 100).toFixed(2)}</span>
			</div>
			<Button size="lg" variant="default" type="button" on:click={() => (page = 2)}>Next</Button>
		</div>
	</div>

	<div class={page !== 2 ? 'hidden' : 'contents'}>
		<div class="mx-auto w-full max-w-prose">
			<h2 class="text-sm text-slate-500">Address</h2>
			<h2 class="text-sm text-slate-500">Appointment Time</h2>
			<h2 class="text-sm text-slate-500">Request Summary</h2>
			<div class="flex items-baseline justify-between">
				<span>{service.name}</span>
				<div class="flex items-center gap-4">
					<span>{unitCount}</span>
				</div>
			</div>
			<h2 class="text-sm text-slate-500">Price Details</h2>
			<div class="flex items-baseline justify-between">
				<span>Platform Fee</span>
				<span>RM {(SERVICE_CHARGE / 100).toFixed(2)}</span>
			</div>
			<div class="flex items-baseline justify-between">
				<span>Service Fee</span>
				<span>RM {(totalPrice / 100).toFixed(2)}</span>
			</div>
		</div>
		<div
			class="sticky bottom-14 mt-auto flex flex-col gap-6 rounded-t-lg bg-slate-100 px-4 py-5 lg:bottom-0"
		>
			<div class="flex items-baseline justify-between">
				<span class="text-sm text-slate-600">Total</span>
				<span class="text-2xl" aria-label="Total Price"
					>RM {(totalPriceWithCharge / 100).toFixed(2)}</span
				>
			</div>
			<Button size="lg" variant="default" type="submit">Pay</Button>
		</div>
	</div>
</form>
