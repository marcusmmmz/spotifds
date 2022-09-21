<script lang="ts">
	import { createMenuStore } from "$lib/ContextMenu/ContextMenu.svelte";
	import { db, type ISong } from "$lib/db";
	import { currentlyPlayingSong } from "$lib/stores";
	import { useLiveQuery } from "$lib/utils";
	import EditSongModal from "./EditSongModal.svelte";
	import SongContextMenu from "./SongContextMenu.svelte";

	let uploadedSongs = useLiveQuery(() => db.songs.toArray(), []);

	async function playSong(id: ISong["id"]) {
		if (!id) return;

		let song = await db.songs.get(id);

		if (!song) return;

		$currentlyPlayingSong = song;
	}

	let songMenuStore = createMenuStore();

	let selectedSongID: number | undefined;

	let showModal = false;
</script>

<EditSongModal bind:visible={showModal} bind:songId={selectedSongID} />

<SongContextMenu
	bind:store={songMenuStore}
	on:delete={() => {
		if (!selectedSongID) return;

		db.songs.delete(selectedSongID);
	}}
	on:edit={() => (showModal = true)}
/>

<h2>Uploaded Songs</h2>
<div class="container">
	<ul>
		{#if $uploadedSongs}
			{#each $uploadedSongs as song}
				<li
					on:click={() => playSong(song.id)}
					on:contextmenu={(e) => {
						songMenuStore.open(e);
						selectedSongID = song.id;
					}}
				>
					🎵 {song.title} by {song.author}
				</li>
			{/each}
		{/if}
	</ul>
</div>

<style>
	.container {
		background-color: #444444;
		height: 75%;
		padding: 12px 12px;
	}

	ul,
	li {
		list-style-type: none;
		color: rgb(202, 202, 202);
		transition: 0.3s;
	}

	li:hover {
		cursor: pointer;
		color: white;
		transition: 0.3s;
	}
</style>
