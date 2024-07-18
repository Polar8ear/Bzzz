<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button/index.js'
	export let data
	const { user, serviceProvider } = data
</script>

<main class="flex flex-grow flex-col">
	{#if user}
		<div>
			<div class="flex items-center gap-3 border-b-2 px-6 pb-6 pt-5">
				<img
					src="data:image/jpeg;base64,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"
					alt="Profile"
					width="40px"
					height="40px"
					class="aspect-square rounded-full bg-gray-300 object-cover"
				/>
				<span>{user.email}</span>
			</div>
		</div>
		<ul>
			<h2 class="px-6 py-4 text-lg text-gray-500">Account Settings</h2>
			<!-- <li class="px-6 py-4"><a href="/profile/edit">Edit Profile</a></li> -->
			<!-- <li class="px-6 py-4"><a href="/profile/change-password">Change change-password</a></li> -->
			<li class="px-6 py-4"><a href="/profile/addresses">Addresses</a></li>
			<li class="px-6 py-4">
				{#if serviceProvider}
					<a href="/profile/service-provider">Service Provider Dashboard</a>
				{:else}
					<a href="/service-provider/sign-up">Become a service provider</a>
				{/if}
			</li>
			<li class="px-6 py-4">
				<form action="/logout" method="POST" use:enhance>
					<button type="submit">Sign out</button>
				</form>
			</li>
		</ul>
	{:else}
		<Button variant={'default'} class="mx-auto my-auto w-full max-w-md" href="/sign-in"
			>Sign in</Button
		>
	{/if}
</main>
