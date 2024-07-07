<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	export let data
	const { user } = data
</script>

<h1 class="text-xl">Welcome to Bzzz</h1>
{#if user}
	<div>Signed in</div>
	<div>{user.id}</div>
{:else}
	<Button href="/sign-in">Sign in</Button>
	<div>Not signed in</div>
{/if}

<p>lorem200</p>
