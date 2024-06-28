<script>
	import { page } from '$app/stores'
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<div>
		<p class="opacity-50">Error Occured:</p>
		<h1 class="text-3xl">{$page.error?.message}</h1>
		{#if $page.error?.errorId != null}
			<p>
				You can contact thes system with this id ({$page.error?.errorId}) to let them know the
				investigate
			</p>
		{/if}

		{#if $page.status === 401}
			{#if $page.data.user != null}
				You dont have Access to this page. Go back
			{:else}
				<a href="/sign-in">Log In Here</a>
			{/if}
		{/if}
	</div>
</div>
