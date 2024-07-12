<script>
	import HomeIcon from 'virtual:icons/carbon/home'
	import DrillIcon from '$lib/icons/drill-icon.svelte'
	import ProfileIcon from 'virtual:icons/gg/profile'
	// import MailIcon from 'virtual:icons/material-symbols/mail-outline'

	export let isLoggedIn = false
</script>

<div class="font- sticky bottom-0 block w-full bg-slate-100">
	<ul class="mx-2 flex justify-center align-middle text-3xl md:mx-auto md:max-w-md">
		<li class="px-4 py-4">
			<a class="flex items-center justify-center" href="/dashboard"
				><span class="sr-only">Home</span><HomeIcon /></a
			>
		</li>
		<li class="px-4 py-4">
			<a class="flex items-center justify-center" href="/services"
				><span class="sr-only">Search services</span><DrillIcon /></a
			>
		</li>
		<!-- <li class="px-4 py-4">
			<a class="flex items-center justify-center" href="/messages"
				><span class="sr-only">Chat</span><MailIcon /></a
			>
		</li> -->
		<li class="px-4 py-4">
			<a class="flex items-center justify-center" href={isLoggedIn ? '/profile' : '/sign-up'}
				><span class="sr-only">Profile</span><ProfileIcon /></a
			>
		</li>
	</ul>
</div>
