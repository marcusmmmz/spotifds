<script lang="ts">
	import { db, type ISong } from "$lib/db";
	import { currentlyPlayingSong } from "$lib/stores";
	import { useLiveQuery } from "$lib/utils";

	let uploadedSongs = useLiveQuery(() => db.songs.toArray(), []);

	async function playSong(id: ISong["id"]) {
		if (!id) return;

		let song = await db.songs.get(id);

		if (!song) return;

		$currentlyPlayingSong = song;
	}
</script>

<h2>Uploaded Songs</h2>
<div class="container">
	<ul>
		{#if $uploadedSongs}
			{#each $uploadedSongs as song}
				<li on:click={() => playSong(song.id)}>
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
