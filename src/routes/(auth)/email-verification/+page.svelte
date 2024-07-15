<script>
	export let data
</script>

<div class="p-4">
	{#if data.hasInvalidToken}
		<div
			class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
			role="alert"
		>
			<span class="block sm:inline">You have an invalid token</span>
		</div>
	{/if}

	<form method="GET">
		<label for="token-input" class="mb-2 block">Enter your token</label>
		<input
			type="text"
			name="token"
			id="token-input"
			class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
		/>

		<button
			type="submit"
			class="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
			>Submit</button
		>
	</form>
</div>
