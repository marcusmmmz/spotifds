<script lang="ts">
	import type { PageData } from "./$types";
	import { db, type IPlaylist, type ISong } from "$lib/db";
	import { useLiveQuery } from "$lib/utils";
	import { currentlyPlayingSong, currentPlaylist, isPaused } from "$lib/stores";
	import { onMount } from "svelte";
	import { useContextMenu } from "$lib/ContextMenu/ContextMenu.svelte";
	import SongContextMenu from "$lib/SongContextMenu.svelte";
	import EditSongModal from "$lib/EditSongModal.svelte";
	import { page } from "$app/stores";
	import Song from "$lib/Song.svelte";
	import MenuOption from "$lib/ContextMenu/MenuOption.svelte";

	export let data: PageData;

	let selectedSongID: ISong["id"];

	let playlist: IPlaylist;

	let songMenuStore = useContextMenu();

	async function updatePlaylist() {
		playlist = (await db.playlists.get(playlistId)) ?? {
			title: "Unknown",
		};
	}

	$: playlistId, updatePlaylist();

	$: playlistId = parseInt(data.playlistId);

	$: songsInPlaylist = useLiveQuery(
		() => db.playlistSongs.where("playlistId").equals(playlistId).toArray(),
		[]
	);

	$: songsBulk = useLiveQuery(() => {
		let orderedSongsInPlaylist = $songsInPlaylist.sort(
			(a, b) => a.index - b.index
		);

		let songIds = orderedSongsInPlaylist.map((song) => song.songId as number);

		return db.songs.bulkGet(songIds);
	}, []);

	$: songs = $songsBulk.filter((song) => song !== undefined) as ISong[];

	async function playSong(song: ISong) {
		$currentPlaylist = playlist;
		$currentlyPlayingSong = song;
		$isPaused = false;
	}

	function removeFromPlaylist() {
		if (!selectedSongID) return;

		db.playlistSongs.delete([playlistId, selectedSongID]);
	}
</script>

<SongContextMenu store={songMenuStore} bind:songId={selectedSongID}>
	<MenuOption on:click={removeFromPlaylist}>➕ Remove from playlist</MenuOption>
</SongContextMenu>

<h2>{playlist?.title} playlist</h2>
<ul>
	{#each songs as song}
		<Song
			{playlistId}
			{song}
			on:click={() => playSong(song)}
			on:contextmenu={(e) => {
				songMenuStore.open(e);
				selectedSongID = song.id;
			}}
		/>
	{/each}
</ul>

<style>
	ul {
		padding-left: 0;
	}
</style>
