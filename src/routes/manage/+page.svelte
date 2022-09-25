<script lang="ts">
	import { db } from "$lib/db";
	import { ipfs } from "$lib/ipfs";

	let file: string | ArrayBuffer | undefined;
	let fileName = "";

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
		let song = e.currentTarget?.files?.item(0);
		if (!song) return;

		fileName = song.name;

		let reader = new FileReader();
		reader.readAsArrayBuffer(song);
		reader.onload = (e) => {
			let res = e?.target?.result;
			if (!res) return;
			file = res;
		};
	};

	async function onSubmit() {
		if (!file) return;

		await addSong(fileName, file);
	}
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
		<input id="file-upload" type="file" accept="*" on:change={onFileSelected} />
		<button type="submit">Upload File</button>
	</form>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;

		background-color: var(--secondary-background-color);
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		font-size: 24px;
	}

	input[type="text"] {
		padding: 12px 12px;
		border-radius: 3%;
		border: none;
		outline: none;
		background-color: #333333;
		margin: 5px 0;
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
