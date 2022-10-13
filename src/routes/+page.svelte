<script lang="ts">
	import { useContextMenu } from "$lib/ContextMenu/ContextMenu.svelte";
	import { db, type ISong } from "$lib/db";
	import { currentlyPlayingSong, currentPlaylist, isPaused } from "$lib/stores";
	import { useLiveQuery } from "$lib/utils";
	import SongContextMenu from "$lib/SongContextMenu.svelte";
	import { onMount } from "svelte";
	import Song from "$lib/Song.svelte";

	let songs: ISong[];
	let uploadedSongs = useLiveQuery(() => db.songs.toArray(), []);

	async function playSong(song: ISong) {
		$currentPlaylist = null;
		$currentlyPlayingSong = song;
		$isPaused = false;
	}

	let songMenuStore = useContextMenu();

	let selectedSongID: number | undefined;

	onMount(async () => {
		let audio = document.createElement("audio");
		songs = await db.songs.toArray();

		let index = -1;

		function next() {
			let nextSong = songs[++index];

			if (nextSong && nextSong.duration) {
				next();
			} else {
				if (!nextSong) return;

				audio.src = `https://ipfs.io/ipfs/${nextSong.cid}?filename=.mp3`;
			}
		}

		audio.onloadedmetadata = () => {
			let duration = audio.duration;
			db.songs.update(songs[index], { duration });
			next();
		};

		next();
	});
</script>

<SongContextMenu bind:store={songMenuStore} bind:songId={selectedSongID} />

<h2>Uploaded Songs</h2>
<div class="container">
	<ul>
		{#each $uploadedSongs as song}
			<Song
				on:click={() => playSong(song)}
				on:contextmenu={(e) => {
					songMenuStore.open(e);
					selectedSongID = song.id;
				}}
				playlistId={undefined}
				{song}
			/>
		{/each}
	</ul>
</div>

<style>
	ul {
		padding-left: 0;
	}
</style>
