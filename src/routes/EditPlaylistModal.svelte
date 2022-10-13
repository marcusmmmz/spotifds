<script lang="ts">
	import Modal from "$lib/Modal.svelte";
	import { db, type IPlaylist } from "$lib/db";

	export let visible = false;
	export let playlistId: IPlaylist["id"];

	let title = "";

	$: if (visible) startEditing();

	async function startEditing() {
		if (!playlistId) return;

		let playlist = await db.playlists.get(playlistId);

		if (!playlist) return;

		playlistId = playlist.id;
		title = playlist.title;
	}

	async function onSubmit() {
		if (!playlistId) return;

		await db.playlists.update(playlistId, {
			title,
		});

		visible = false;
	}
</script>

<Modal title="Edit playlist" bind:visible>
	<div class="container">
		<form on:submit|preventDefault={onSubmit}>
			<div class="group">
				<input required type="text" bind:value={title} />
				<p>Title</p>
			</div>
			<div class="button-container">
				<button class="button" on:click={() => (visible = false)}>Cancel</button
				>
				<button class="button" type="submit">Edit</button>
			</div>
		</form>
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
</style>
