<script lang="ts">
	import { useContextMenu } from "$lib/ContextMenu/ContextMenu.svelte";
	import { db } from "$lib/db";
	import { currentPlaylist } from "$lib/stores";
	import { useLiveQuery } from "$lib/utils";
	import EditPlaylistModal from "./EditPlaylistModal.svelte";
	import PlaylistContextMenu from "./PlaylistContextMenu.svelte";

	let playlists = useLiveQuery(() => db.playlists.toArray(), []);

	let playlistMenuStore = useContextMenu();

	let selectedPlaylistID: number | undefined;

	let showEditModal = false;
</script>

<PlaylistContextMenu
	bind:store={playlistMenuStore}
	on:edit={() => (showEditModal = true)}
	on:delete={() => {
		if (!selectedPlaylistID) return;

		db.playlists.delete(selectedPlaylistID);
	}}
/>

<EditPlaylistModal
	bind:visible={showEditModal}
	bind:playlistId={selectedPlaylistID}
/>

{#each $playlists as playlist}
	<div
		on:contextmenu={(e) => {
			playlistMenuStore.open(e);
			selectedPlaylistID = playlist.id;
		}}
	>
		<a
			href="/playlists/{playlist.id}"
			class:playing={$currentPlaylist?.id == playlist.id}
		>
			{playlist.title}
		</a>
	</div>
{/each}

<style>
	.playing {
		color: var(--pink);
	}

	div {
		display: flex;
		align-items: center;
		margin-left: 10px;
	}

	div a {
		margin-left: 0;
	}

	a:hover,
	a:hover {
		transition: 0.3s;
		padding-left: 10px;
	}
</style>
