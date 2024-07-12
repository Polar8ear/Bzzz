<script lang="ts">
	import FilledStarIcon from 'virtual:icons/fa6-solid/star'
	import HollowStarIcon from 'virtual:icons/fa6-regular/star'
	import HalfFilledStarIcon from 'virtual:icons/fa6-regular/star-half-stroke'

	const TOTAL_STAR = 5
	// ratings is a number between 0 and 5 {TOTAL_STAR}
	export let ratings

	if (ratings < 0 || ratings > TOTAL_STAR) {
		throw new Error(`Ratings must be between 0 and ${TOTAL_STAR}`)
	}

	const filledStars = Math.floor(ratings)
	const halfFilledStar = ratings - filledStars >= 0.5
	const hollowStar = TOTAL_STAR - filledStars - (halfFilledStar ? 1 : 0)
</script>

<div class="flex">
	{#each Array(filledStars) as _}
		<FilledStarIcon />
	{/each}
	{#if halfFilledStar}
		<HalfFilledStarIcon />
	{/if}
	{#each Array(hollowStar) as _}
		<HollowStarIcon />
	{/each}
</div>
