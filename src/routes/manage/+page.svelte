<script lang="ts">
	import { db, type ISong } from "$lib/db";
	import { ipfs } from "$lib/ipfs";
	import { useLiveQuery } from "$lib/utils";

	let file: string | ArrayBuffer | undefined;
	let fileName = "";

	let editedSongId: ISong["id"] | null = null;
	$: isEditing = editedSongId != null;

	let title = "";
	let author = "";

	async function addSong(path: string, content: string | ArrayBuffer) {
		if (!ipfs) return;

		if (title.trim() == "" || author.trim() == "") return;

		let file = await ipfs.add(
			{
				path,
				content,
			},
			{
				pin: true,
			}
		);

		console.log(`https://ipfs.io/ipfs/${file.cid}`);

		db.songs.add({
			title,
			author,
			cid: file.cid.toString(),
		});

		title = "";
		author = "";

		alert(`https://ipfs.io/ipfs/${file.cid}`);
	}

	const onFileSelected = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		let image = e.currentTarget?.files?.item(0);
		if (!image) return;

		fileName = image.name;

		let reader = new FileReader();
		reader.readAsArrayBuffer(image);
		reader.onload = (e) => {
			let res = e?.target?.result;
			if (!res) return;
			file = res;
		};
	};

	function startEditing(song: ISong) {
		editedSongId = song.id;
		title = song.title;
		author = song.author;
	}

	function stopEditing() {
		editedSongId = null;
		title = "";
		author = "";
	}

	async function onSubmit() {
		if (isEditing) {
			if (!editedSongId) return;

			await db.songs.update(editedSongId, {
				title,
				author,
			});
		} else {
			if (!file) return;

			await addSong(fileName, file);
		}
	}

	function deleteSong(id: ISong["id"]) {
		if (!id) return;
		db.songs.delete(id);
	}

	let uploadedSongs = useLiveQuery(() => db.songs.toArray(), []);
</script>

<h2>Manage your music</h2>
<div class="container">
	<h2>Upload a music file</h2>
	<form on:submit|preventDefault={onSubmit} class="music-upload-container">
		<label>
			Title
			<input
				placeholder="Billie Jean"
				required
				type="text"
				bind:value={title}
			/>
		</label>
		<label>
			Author
			<input
				placeholder="Michael Jackson"
				required
				type="text"
				bind:value={author}
			/>
		</label>
		{#if isEditing}
			<button on:click={stopEditing}>Stop editing</button>
		{:else}
			<input
				id="file-upload"
				type="file"
				accept="*"
				on:change={onFileSelected}
			/>
		{/if}
		<button type="submit">{isEditing ? "Update" : "Upload File"}</button>
	</form>

	<ul>
		{#if $uploadedSongs}
			{#each $uploadedSongs as song}
				<li>
					<span on:click={() => deleteSong(song.id)}>🗑️</span>
					<span on:click={() => startEditing(song)}>
						{song.title} - {song.author}
					</span>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;

		background-color: #444444;
		height: 75%;
		padding: 12px 12px;
	}

	.music-upload-container {
		display: flex;
		flex-direction: column;
		width: 50%;
		align-items: center;
	}

	label {
		font-size: 24px;
	}

	input[type="text"] {
		padding: 12px 12px;
		border-radius: 3%;
		border: none;
		outline: none;
		background-color: #333333;
		margin-top: 15px;
		color: #ffffff;
	}

	button {
		padding: 12px 12px;
		outline: none;
		border: none;
		background-color: rgb(55, 141, 255);
		color: white;
	}

	input[type="file"] {
		margin-top: 15px;
		margin-bottom: 15px;
	}
</style>
