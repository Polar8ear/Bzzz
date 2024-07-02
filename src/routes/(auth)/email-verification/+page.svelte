<script>
	export let data
</script>

{#if data.hasInvalidToken}
	<div>You have an invalid token</div>
{/if}
<form method="GET">
	<label for="token-input">Enter your token</label>
	<input type="text" name="token" id="token-input" class="border" />
</form>
