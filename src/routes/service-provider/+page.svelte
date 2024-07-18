<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	export let data
</script>

<main>
	<h1>Dashboard</h1>
	<section>
		<h2>Requests Available</h2>
		<ul class="flex flex-col gap-2 divide-y">
			{#each data.requests as request}
				<li class="px-4">
					<a href="/service-provider/request/{request.id}">
						<h3>{request.service?.name}</h3>
						<p>{request.startedAt}</p>
					</a>
					<form action="?" method="post">
						<input type="text" name="requestId" value={request.id} hidden />
						<Button type="submit">Accept</Button>
					</form>
				</li>
			{/each}
		</ul>
	</section>
</main>
