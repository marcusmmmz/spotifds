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
	<div class="upload-music-container">
		<h2>Upload a music file</h2>
		<form on:submit|preventDefault={onSubmit}>
			<div class="group">
				<input
					required
					type="text"
					bind:value={title}
				>
				<p>Title</p>
			</div>
			<div class="group">
				<input
					required
					type="text"
					bind:value={author}
				/>
				<p>Author</p>
			</div>
			<button class="button" disabled={file != undefined} type="button">
				<label for="file-upload" class="custom-file-upload">
					{fileName == "" ? "Select music file" : `${fileName} selected`}
				</label>
			</button>
			<input hidden id="file-upload" type="file" accept="*" on:change={onFileSelected} />
			{#if file}
				<button class="button" type="submit">Upload</button>
			{/if}
		</form>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.upload-music-container {
		display: flex;
		flex-direction: column;

		background-color: var(--secondary-background-color);
		width: 90%;
		padding: 2% 2%;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		justify-content: center;
	}

	input[type="file"] {
		margin-top: 15px;
		margin-bottom: 15px;
	}
</style>
