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
	<MenuOption on:click={() => dispatch("edit")}>📝 Edit</MenuOption>
	<MenuOption on:click={() => dispatch("delete")}>🗑️ Delete</MenuOption>
	<MenuDivider />
	<MenuOption on:click={() => dispatch("share")}>📡 Share</MenuOption>
</ContextMenu>
