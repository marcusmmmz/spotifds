<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	export let visible = false;
	export let title = "";

	const dispatch = createEventDispatcher();

	function close() {
		visible = false;
		dispatch("close");
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape") close();
	}

	onMount(() => {
		const previously_focused = document.activeElement as HTMLElement | null;

		if (previously_focused) {
			return () => previously_focused.focus();
		}
	});
</script>

<svelte:window on:keydown={onKeyDown} />

{#if visible}
	<div class="modal-background" on:click={close} />

	<div class="modal" role="dialog" aria-modal="true">
		<h1>{title}</h1>
		<hr />
		<slot />
	</div>
{/if}

<style>
	h1 {
		margin: auto 0;
	}

	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 32em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%, -50%);
		padding: 1em;
		border-radius: 0.2em;
		background: rgba(32, 32, 32);
	}
</style>
