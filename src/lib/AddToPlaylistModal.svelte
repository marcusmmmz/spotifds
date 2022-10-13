<script lang="ts">
	import Modal from "$lib/Modal.svelte";
	import { db, type IPlaylist, type ISong } from "$lib/db";
	import { useLiveQuery } from "$lib/utils";
	import Playlist from "./Playlist.svelte";

	export let visible = false;
	export let songId: ISong["id"];

	let creatingPlaylist = false;
	let title = "";

	let playlists = useLiveQuery(() => db.playlists.toArray(), []);

	async function createPlaylist() {
		let playlistId = await db.playlists.add({
			title,
		});

		await addToPlaylist(playlistId);

		visible = false;
	}

	async function addToPlaylist(playlistId: IPlaylist["id"]) {
		let count = await db.playlistSongs
			.where("playlistId")
			.equals(playlistId as number)
			.count();

		db.playlistSongs.add({
			playlistId,
			songId,
			index: count,
		});

		visible = false;
	}

	$: if (!visible) creatingPlaylist = false;

	$: visible, (title = "");
</script>

<Modal title="Add to playlist" bind:visible>
	<div class="container">
		{#if creatingPlaylist}
			<form>
				<div class="group">
					<input required type="text" bind:value={title} />
					<p>Title</p>
				</div>
			</form>
		{:else}
			<button class="button" on:click={() => (creatingPlaylist = true)}
				>Create new playlist</button
			>
			<ul>
				{#each $playlists as playlist}
					<Playlist {playlist} on:click={() => addToPlaylist(playlist.id)} />
				{/each}
			</ul>
		{/if}

		<div class="button-container">
			<button class="button" on:click={() => (visible = false)}>Cancel</button>
			{#if creatingPlaylist}
				<button class="button" on:click={createPlaylist}>Create</button>
			{/if}
		</div>
	</div>
</Modal>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 50%;
		align-items: center;
	}

	.button-container {
		margin-top: 10%;
		display: flex;
		gap: 10%;
		width: 100%;
		justify-content: center;
	}

	ul {
		padding: 0;
		width: 100%;

		color: rgb(202, 202, 202);
		transition: 0.3s;
	}
</style>
