<script lang="ts">
	import Modal from "$lib/Modal.svelte";
	import { db, type ISong } from "$lib/db";

	export let visible = false;
	export let songId: ISong["id"];

	let title = "";
	let author = "";

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
			<label>
				<span>Title</span>
				<input
					placeholder="Billie Jean"
					required
					type="text"
					bind:value={title}
				/>
			</label>
			<label>
				<span>Author</span>
				<input
					placeholder="Michael Jackson"
					required
					type="text"
					bind:value={author}
				/>
			</label>
			<div class="button-container">
				<button on:click={() => (visible = false)}>Cancel</button>
				<button type="submit">Edit</button>
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

	label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		font-size: 24px;
	}

	input {
		padding: 12px 12px;
		border-radius: 3%;
		border: none;
		background-color: #333333;
		margin: 5px 0;
		color: #ffffff;
	}

	.button-container {
		margin-top: 10%;
		display: flex;
		gap: 10%;
		width: 100%;
		justify-content: center;
	}

	button {
		width: 30%;
		padding: 12px 12px;
		border: none;
		background-color: rgb(55, 141, 255);
		color: white;
	}
</style>
