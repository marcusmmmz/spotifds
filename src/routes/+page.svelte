<script lang="ts">
	import { createMenuStore } from '$lib/ContextMenu/ContextMenu.svelte';
	import { db, type ISong } from '$lib/db';
	import { currentlyPlayingSong, isPaused } from '$lib/stores';
	import { useLiveQuery } from '$lib/utils';
	import EditSongModal from './EditSongModal.svelte';
	import SongContextMenu from './SongContextMenu.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let songs: ISong[];
	let uploadedSongs = useLiveQuery(() => db.songs.toArray(), []);

	async function playSong(song: ISong) {
		$currentlyPlayingSong = song;
		$isPaused = false;
	}

	let songMenuStore = createMenuStore();

	let selectedSongID: number | undefined;

	let showEditModal = false;

	async function shareSong() {
		if (!selectedSongID) return;

		let song = await db.songs.get(selectedSongID);

		if (!song) return;

		let params = new URLSearchParams();

		params.set('title', song.title);
		params.set('author', song.author);
		params.set('cid', song.cid);
		if (song.duration) {
			params.set('duration', song.duration.toString());
		}

		let shareUrl = `${$page.url.href}share?${params}`;

		navigator.clipboard.writeText(shareUrl);

		alert(
			`A sharing link to "${song.title} - ${song.author}" was copied to your clipboard`
		);
	}

	const calculateTime = (secs?: number) => {
		if (!secs) return '--:--';

		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${returnedSeconds}`;
	};

	let songsContainerEl: HTMLElement;

	onMount(async () => {

		let audio = document.createElement('audio');
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
			// console.log(duration);
			db.songs.update(songs[index], { duration });
			next();
		};

		next();
	});
</script>

<EditSongModal bind:visible={showEditModal} bind:songId={selectedSongID} />

<SongContextMenu
	bind:store={songMenuStore}
	on:delete={() => {
		if (!selectedSongID) return;

		db.songs.delete(selectedSongID);
	}}
	on:edit={() => (showEditModal = true)}
	on:share={shareSong}
/>

<h2>Uploaded Songs</h2>
<div class="container" bind:this={songsContainerEl}>
	<ul>
		{#if $uploadedSongs}
			{#each $uploadedSongs as song}
				<li
					on:click={() => playSong(song)}
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
		background-color: var(--secondary-background-color);
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
