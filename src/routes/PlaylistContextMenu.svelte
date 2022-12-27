<script lang="ts">
	import ContextMenu from "$lib/ContextMenu/ContextMenu.svelte";
	import type { ContextMenuStore } from "$lib/ContextMenu/ContextMenu.svelte";
	import MenuDivider from "$lib/ContextMenu/MenuDivider.svelte";
	import MenuOption from "$lib/ContextMenu/MenuOption.svelte";
	import { page } from "$app/stores";
	import { ipfs } from "$lib/ipfs";
	import { db, type IPlaylist } from "$lib/db";
	import { filterUndefined } from "$lib/utils";
	import EditPlaylistModal from "./EditPlaylistModal.svelte";
	import type { ISharedPlaylist } from "$lib/types";

	export let selectedPlaylistID: IPlaylist["id"];

	export let store: ContextMenuStore;

	let showEditModal = false;

	async function share() {
		if (!ipfs) return;

		if (!selectedPlaylistID) return;

		let playlist = await db.playlists.get(selectedPlaylistID);

		if (!playlist) return;

		let playlistSongs = await db.playlistSongs
			.where("playlistId")
			.equals(selectedPlaylistID)
			.toArray();

		let songs = filterUndefined(
			await db.songs.bulkGet(
				filterUndefined(
					playlistSongs.map((playlistSong) => playlistSong.songId)
				)
			)
		);

		let playlistRepresentation: ISharedPlaylist = {
			// excludes id and duration
			songs: songs.map(({ id, duration, ...rest }) => ({
				...rest
			}))
		};

		let playlistCID = await ipfs.dag.put(playlistRepresentation, {
			pin: true
		});

		let params = new URLSearchParams();

		params.set("cid", playlistCID.toString());
		params.set("title", playlist.title.toString());

		let shareUrl = `${$page.url.origin}/share/playlist?${params}`;

		navigator.clipboard.writeText(shareUrl);

		alert(`A sharing link to "${playlist.title}" was copied to your clipboard`);
	}
</script>

<EditPlaylistModal
	bind:visible={showEditModal}
	bind:playlistId={selectedPlaylistID}
/>

<ContextMenu bind:store>
	<MenuOption on:click={() => (showEditModal = true)}>📝 Edit</MenuOption>
	<MenuOption
		on:click={() => {
			if (!selectedPlaylistID) return;

			db.playlists.delete(selectedPlaylistID);
		}}>🗑️ Delete</MenuOption
	>
	<MenuDivider />
	<MenuOption on:click={share}>📡 Share</MenuOption>
</ContextMenu>
