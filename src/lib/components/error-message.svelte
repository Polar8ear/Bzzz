<script lang="ts">
	export let errors: string[] | undefined
	export let name: string
</script>

{#if errors != null && errors.length > 0}
	<p id="{name}-error" class="text-red-400">
		{#each errors ?? [] as error}
			<span>{error}</span>
		{/each}
	</p>
{/if}
