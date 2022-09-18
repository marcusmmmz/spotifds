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
<div class="uploadedSongContent">
	<ul>
		{#if $uploadedSongs}
			{#each $uploadedSongs as song}
				<li on:click={() => playSong(song.id)}>
					<img alt="" src="/tune.png" />{song.title} by {song.author}
				</li>
			{/each}
		{/if}
	</ul>
</div>
