<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { log } from '$lib/log.js'

	export let data
	$: log.debug(data)
</script>

<h1 class="text-xl">Welcome to Bzzz</h1>
{#if data.user}
	<div>Signed in</div>
	<div>{data.user.id}</div>
	<Button href="/dashboard">Dashboard</Button>
{:else}
	<Button href="/sign-up">Sign up</Button>
	<Button href="/login">Sign in</Button>
	<div>Not signed in</div>
{/if}
