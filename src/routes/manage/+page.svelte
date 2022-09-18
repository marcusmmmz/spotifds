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

		let file = await ipfs.add({
			path,
			content,
		});
		console.log(file.path);

		console.log("pinning");
		await ipfs.pin.add(file.cid);

		console.log("pinned");

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

	async function onAddSongPressed() {
		console.log(file);
		if (!file) return;

		await addSong(fileName, file);
	}
</script>

<h2>Manage your music</h2>
<div class="uploadedSongContent">
	<form
		on:submit|preventDefault={onAddSongPressed}
		class="music-upload-container"
	>
		<h2>Upload a music file</h2>
		<label>
			Title
			<input required type="text" bind:value={title} />
		</label>
		<label>
			Author
			<input required type="text" bind:value={author} />
		</label>
		<input id="file-upload" type="file" accept="*" on:change={onFileSelected} />
		<button type="submit">Upload File</button>
	</form>
</div>

<style>
	.uploadedSongContent {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.music-upload-container {
		display: flex;
		flex-direction: column;
		width: 50%;
		align-items: center;
	}
</style>
