<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { getUser } from '$lib/stores/userStore'

	const user = getUser()
</script>

<h1 class="text-xl">Welcome to Bzzz</h1>
{#if user}
	<div>Signed in</div>
	<div>{user.id}</div>
{:else}
	<Button href="/login">Sign in</Button>
	<div>Not signed in</div>
{/if}

<p>lorem200</p>
