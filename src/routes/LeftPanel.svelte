<script lang="ts">
	import { db } from "$lib/db";
	import { ipfs } from "$lib/ipfs";

	let file: string | ArrayBuffer | undefined;
	let fileName = "";

	async function cat(cid: any /*Parameters<typeof ipfs.cat>[0]*/) {
		if (!ipfs) return;

		console.log(cid);

		const stream = ipfs.cat(cid);
		const decoder = new TextDecoder();
		let data = "";

		for await (const chunk of stream) {
			data += decoder.decode(chunk, { stream: true });
		}

		return data;
	}

	async function addSong(path: string, content: string | ArrayBuffer) {
		if (!ipfs) return;

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
			title: file.path,
			author: "Unknown",
			cid: file.cid.toString(),
		});
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

<div class="leftFds">
	<h1>Upload ur mom</h1>
	<div class="fileInput">
		<input id="file-upload" type="file" accept="*" on:change={onFileSelected} />
		<button on:click={onAddSongPressed} type="submit">Upload File</button>
	</div>
</div>

<style>
	.leftFds {
		max-width: 25%;
		padding: 25px 25px;
	}

	.fileInput {
		background-color: white;
		padding: 12px 12px;
		border-radius: 12px;
		color: black;
		font-size: 18px;
	}

	.fileInput button {
		margin-top: 12px;
		padding: 6px 12px;
		background-color: rgb(100, 100, 255);
		color: white;
		border: none;
		border-radius: 3%;
	}
</style>
