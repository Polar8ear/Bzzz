<script lang="ts">
	import { Button } from '$lib/components/ui/button/index'
	import { convertAddress } from '$lib/utils/addressUtil'

	export let data

	const { request } = data
	const { address } = request
</script>

<main>
	<h1>Requests</h1>
	<h2>Request ID: {request.id}</h2>
	<p>Address: {convertAddress(address)}</p>
	<p>Service Provider: {request.serviceProvider ? 'Secured' : 'N/A'}</p>
	<p>Service: {request.service.name}</p>
	<p>Details: {request.details ?? 'N/A'}</p>
	<p>Price: {request.price}</p>
	<p>Unit Count: {request.unitCount}</p>
	<p>Started At: {new Date(request.startedAt).toLocaleString()}</p>
	<p>Ended At: {new Date(request.endedAt).toLocaleString()}</p>
	<p>
		Completed At: {request.completedAt ? new Date(request.completedAt).toLocaleString() : 'N/A'}
	</p>
	<p>Paid At: {request.paidAt ? new Date(request.paidAt).toLocaleString() : 'N/A'}</p>
	<p>
		Deleted At: {request.deletedAt ? new Date(request.deletedAt).toLocaleString() : 'N/A'}
	</p>
	<p>Created At: {new Date(request.createdAt).toLocaleString()}</p>
	<p>Updated At: {new Date(request.updatedAt).toLocaleString()}</p>

	<form action="?" method="post" class="mx-2 flex flex-col gap-2">
		<div>
			<label for="review-textarea">Review</label>
			<textarea
				name="review"
				id="review-textarea"
				value={request.reviews?.comment ?? ''}
				class="block w-full border"
			></textarea>
		</div>
		<div>
			<label for="rating-input">Rating</label>
			<input
				type="number"
				name="rating"
				id="rating-input"
				min="0"
				max="5"
				value={request.reviews?.rating ?? 0}
				class="block w-full border"
			/>
		</div>
		<Button type="submit">Submit Review</Button>
	</form>
</main>
