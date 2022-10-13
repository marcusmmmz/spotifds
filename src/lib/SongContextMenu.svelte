<script lang="ts">
	import ContextMenu from "$lib/ContextMenu/ContextMenu.svelte";
	import type { MenuStore } from "$lib/ContextMenu/ContextMenu.svelte";
	import MenuDivider from "$lib/ContextMenu/MenuDivider.svelte";
	import MenuOption from "$lib/ContextMenu/MenuOption.svelte";
	import { db, type ISong } from "./db";
	import EditSongModal from "./EditSongModal.svelte";
	import { page } from "$app/stores";

	export let store: MenuStore;

	export let songId: ISong["id"];

	let showEditModal = false;

	async function share() {
		if (!songId) return;

		let song = await db.songs.get(songId);

		if (!song) return;

		let params = new URLSearchParams();

		params.set("title", song.title);
		params.set("author", song.author);
		params.set("cid", song.cid);
		if (song.duration) {
			params.set("duration", song.duration.toString());
		}

		let shareUrl = `${$page.url.href}share?${params}`;

		navigator.clipboard.writeText(shareUrl);

		alert(
			`A sharing link to "${song.title} - ${song.author}" was copied to your clipboard`
		);
	}
</script>

<EditSongModal bind:songId bind:visible={showEditModal} />

<ContextMenu bind:store>
	<MenuOption on:click={() => (showEditModal = true)}>📝 Edit</MenuOption>
	<MenuOption
		on:click={() => {
			if (!songId) return;

			db.songs.delete(songId);
		}}
	>
		🗑️ Delete
	</MenuOption>
	<MenuDivider />
	<MenuOption on:click={share}>📡 Share</MenuOption>
	<slot />
</ContextMenu>
