<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { db, type ISong } from '$lib/db';

	export let visible = false;
	export let songId: ISong['id'];

	let title = '';
	let author = '';

	$: if (visible) startEditing();

	async function startEditing() {
		if (!songId) return;

		let song = await db.songs.get(songId);

		if (!song) return;

		songId = song.id;
		title = song.title;
		author = song.author;
	}

	async function onSubmit() {
		if (!songId) return;

		await db.songs.update(songId, {
			title,
			author,
		});

		visible = false;
	}
</script>

<Modal title="Edit song" bind:visible>
	<div class="container">
		<form on:submit|preventDefault={onSubmit}>
			<div class="group">
				<input required type="text" bind:value={title} />
				<p>Title</p>
			</div>
			<div class="group">
				<input required type="text" bind:value={author} />
				<p>Author</p>
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
