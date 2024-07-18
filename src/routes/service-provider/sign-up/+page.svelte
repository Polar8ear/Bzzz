<script lang="ts">
	import TitleWithBack from '$lib/components/title-with-back.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { convertAddress } from '$lib/utils/addressUtil'
	import PlusIcon from 'virtual:icons/fa6-solid/plus'

	export let data
	const services = data.services.map((service) => ({ ...service, checked: false }))

	$: checkedServices = services.filter((service) => service.checked)
	$: hasCheckedServices = checkedServices.length > 0

	let dialogEl: HTMLDialogElement
</script>

<TitleWithBack
	previousPage="/profile"
	title="Service Provider Sign Up"
	previousPageDescription="Profile Page"
/>
<form action="?" method="POST" class="mx-4 flex h-full flex-grow flex-col gap-4">
	<div>
		<label for="address-select">Address</label>
		<select
			id="address-select"
			name="addressId"
			class=" h-12 w-full text-ellipsis border border-slate-300 px-2"
		>
			{#each data.addresses as address}
				<option value={address.id} label={convertAddress(address)} />
			{/each}
		</select>
	</div>

	<div>
		<p>Services Provided</p>
		<div class="relative border px-4 py-2">
			<ul class="flex flex-wrap items-center justify-start gap-4">
				{#each checkedServices as service}
					<li class="rounded-md bg-slate-200 p-1 px-2 shadow-sm">{service.name}</li>
				{/each}
				<li class={hasCheckedServices ? 'ml-auto' : 'w-full flex-grow'}>
					<button type="button" on:click={() => dialogEl.show()} class="w-full text-left">
						{#if !hasCheckedServices}
							Choose the services you provide
						{:else}
							<PlusIcon /> <span class="sr-only">Choose the services you provide</span>
						{/if}
					</button>
				</li>
			</ul>
			<dialog id="serviceDialog" bind:this={dialogEl} class="absolute left-0 mx-0 px-8 py-4 shadow">
				<div class="flex flex-col gap-2">
					{#each services as service}
						<label>
							<input
								name="services[]"
								type="checkbox"
								value={service.id}
								bind:checked={service.checked}
							/>
							{service.name}
						</label>
					{/each}
				</div>
				<form method="dialog" class="mt-4">
					<button value="close" class="text-slate-500">Close</button>
				</form>
			</dialog>
		</div>
	</div>

	<Button type="submit" class="mt-8">Submit</Button>
</form>
