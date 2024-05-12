<script lang="ts">
	import { Button } from '$lib/components/ui/button'

	export let data
	console.log(data)
</script>

<h1 class="text-xl">Welcome to Bzzz</h1>
{#if data.user}
	<div>Signed in</div>
	<div>{data.user.id}</div>
{:else}
	<Button href="/login">Sign in</Button>
	<div>Not signed in</div>
{/if}
