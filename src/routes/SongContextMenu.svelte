<script lang="ts">
	import ContextMenu from "$lib/ContextMenu/ContextMenu.svelte";
	import type { MenuStore } from "$lib/ContextMenu/ContextMenu.svelte";
	import MenuDivider from "$lib/ContextMenu/MenuDivider.svelte";
	import MenuOption from "$lib/ContextMenu/MenuOption.svelte";
	import { createEventDispatcher } from "svelte";

	export let store: MenuStore;

	const dispatch = createEventDispatcher();
</script>

<ContextMenu bind:store>
	<MenuOption disabled on:click={() => dispatch("edit")}>📝 Edit</MenuOption>
	<MenuOption on:click={() => dispatch("delete")}>🗑️ Delete</MenuOption>
	<MenuDivider />
	<MenuOption disabled>Share</MenuOption>
</ContextMenu>
