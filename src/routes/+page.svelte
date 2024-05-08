<script lang="ts">
	import { Button } from "@/lib/components/ui/button"

	export let data
	console.log(data)
</script>

<h1 class="text-xl">Welcome to Bzzz lol</h1>
{#each data.users as user}
	<li>{user.id}</li>
{/each}
{#if data.user}
	<div>Signed in</div>
	<div>{data.user.id}</div>
{/if}
<h1>Sign in</h1>
<a href="/login/github">Sign in with GitHub</a>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button>Hello World1</Button>
