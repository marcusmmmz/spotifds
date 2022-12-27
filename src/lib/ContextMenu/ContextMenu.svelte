<script lang="ts" context="module">
	import { writable } from "svelte/store";

	let currentlyOpenContextMenu: ContextMenuStore | null;

	export function useContextMenu() {
		let store = {
			...writable({
				pos: { x: 0, y: 0 },
				showMenu: false
			}),
			open,
			close
		};

		function open(e: MouseEvent) {
			e.preventDefault();
			e.stopPropagation();

			const pos = { x: e.clientX, y: e.clientY };

			currentlyOpenContextMenu?.close();

			setTimeout(() => {
				store.set({
					pos,
					showMenu: true
				});
				currentlyOpenContextMenu = store;
			}, 100);
		}

		function close() {
			store.update((value) => ({
				...value,
				showMenu: false
			}));
		}

		return store;
	}

	export type ContextMenuStore = ReturnType<typeof useContextMenu>;

	import { defineContext } from "$lib/utils";

	let [getDispatchClick, setDispatchClick] = defineContext<() => boolean>();

	export { getDispatchClick };
</script>

<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

	let menu: HTMLDivElement;

	export let store: ContextMenuStore;

	$: x = $store.pos.x;
	$: y = $store.pos.y;

	const dispatch = createEventDispatcher();

	setDispatchClick(() => {
		store.close();
		return dispatch("click");
	});

	// Whenever x and y is changed, restrict box to be within bounds
	$: x, y, restrictBoxToBounds();

	function restrictBoxToBounds() {
		if (!menu) return;

		const rect = menu.getBoundingClientRect();

		x = Math.min(window.innerWidth - rect.width, x);

		if (y > window.innerHeight - rect.height) y -= rect.height;
	}

	function onPageClick(e: MouseEvent) {
		// Menu is closed
		if (menu == null) return;

		if (e.target === menu || menu.contains(e.target as Node)) return;
		dispatch("clickoutside");

		store.close();
	}
</script>

<svelte:body on:click={onPageClick} on:contextmenu={onPageClick} />

{#if $store.showMenu}
	<div
		transition:fade={{ duration: 100 }}
		bind:this={menu}
		style="top: {y}px; left: {x}px;"
	>
		<slot />
	</div>
{/if}

<style>
	div {
		position: absolute;
		display: grid;
		border: 1px solid #0003;
		box-shadow: 0px 0px 5px #000;
		background: var(--secondary-background-color);
		z-index: 1;
	}
</style>
