<script lang="ts">
	import BackIcon from 'virtual:icons/fa6-solid/chevron-left'

	export let previousPage: string | (() => void) = '/'
	export let previousPageDescription: string = 'Back to previous page'
	export let title: string

	$: previousPageHref = typeof previousPage === 'function' ? '#' : previousPage
	$: onClick =
		typeof previousPage === 'function'
			? (e: MouseEvent) => {
					e.preventDefault()
					previousPage()
					return false
				}
			: undefined
</script>

<div class="relative mx-4 my-2 flex min-h-16 items-center justify-start gap-4 self-stretch">
	<a
		href={previousPageHref}
		on:click={onClick}
		class="absolute left-0 grid aspect-square h-12 place-content-center"
	>
		<BackIcon height="2rem" width="2rem" />
		<span class="sr-only">{previousPageDescription}</span></a
	>
	<h1 class="flex-grow px-12 text-xl md:text-center">{title}</h1>
</div>
