<script lang="ts">
	import { getDispatchClick } from "./ContextMenu.svelte";
	import { createEventDispatcher } from "svelte";

	export let disabled = false;

	const dispatch = createEventDispatcher();
	const dispatchClickToMenu = getDispatchClick();

	const handleClick = () => {
		if (disabled) return;

		dispatch("click");
		dispatchClickToMenu();
	};
</script>

<div class:disabled on:click={handleClick}>
	<slot />
</div>

<style>
	div {
		padding: 4px 15px;
		cursor: default;
		font-size: 14px;
		display: flex;
		align-items: center;
		grid-gap: 5px;
		background: #333333;
		color: white;
	}
	div:hover {
		background: #0002;
	}
	.disabled {
		color: rgb(128, 128, 128);
	}
</style>
