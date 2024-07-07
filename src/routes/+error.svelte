<script>
	import { dev } from '$app/environment'
	import { page } from '$app/stores'
</script>

<div class="mx-4 flex h-screen flex-col items-center justify-center">
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

		{#if dev}
			<article class="mx-4 mt-10">
				<h2>Dev Only Error Trace</h2>
				<p class="break-all rounded-md bg-slate-700 p-2 leading-8 text-white md:leading-6">
					{$page.error?.originalErrorStack}
				</p>
			</article>
		{/if}
	</div>
</div>
