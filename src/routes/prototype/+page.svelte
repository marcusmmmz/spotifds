<script lang="ts">
	import { create, type IPFS } from "ipfs-core";
	import { onMount } from "svelte";

	let output: HTMLHeadingElement;
	let fileName: HTMLInputElement;
	let fileContent: HTMLInputElement;
	let addBtn: HTMLButtonElement;
	let terminal: HTMLDivElement;

	let ipfs: IPFS;

	let file: string | ArrayBuffer | undefined;

	onMount(() => {
		const COLORS = {
			active: "#357edd",
			success: "#0cb892",
			error: "#ea5037",
		};

		const scrollToBottom = () => {
			terminal.scroll({ top: terminal.scrollHeight, behavior: "smooth" });
		};

		const showStatus = (
			text: string,
			bg: string | undefined = undefined,
			id: any = null
		) => {
			let log = output;

			if (!log) {
				const output = document.createElement("div");
				output.id = "output";
				terminal.appendChild(output);

				log = output;
			}

			const line = document.createElement("p");
			line.innerText = text;
			if (bg) line.style.color = bg;

			if (id) {
				line.id = id;
			}

			log.appendChild(line);

			scrollToBottom();
		};

		const cat = async (cid: Parameters<typeof ipfs.cat>[0]) => {
			console.log(cid);
			const decoder = new TextDecoder();
			let content = "";

			for await (const chunk of ipfs.cat(cid)) {
				content += decoder.decode(chunk, {
					stream: true,
				});
			}

			return content;
		};

		const store = async (
			name: string,
			content: string | Buffer | ArrayBuffer
		) => {
			console.log(name, content);
			if (!ipfs) {
				showStatus("Creating IPFS node...", COLORS.active);

				ipfs = await create({
					repo: String(Math.random() + Date.now()),
					init: { algorithm: "Ed25519" },
				});
			}

			const id = await ipfs.id();
			console.log(id);
			showStatus(`Connecting to ${id.id}...`, COLORS.active, id.id);

			const fileToAdd = {
				path: name,
				content,
			};

			showStatus(`Adding file ${fileToAdd.path}...`, COLORS.active);
			const file = await ipfs.add(fileToAdd);
			console.log(file);

			showStatus(`Added to ${file.cid}`, COLORS.success, file.cid);

			showStatus("Reading file...", COLORS.active);

			const text = await cat(file.cid);
			// console.log(text);

			if (text.length > 100) {
				showStatus(`\u2514\u2500 ${file.path} (Too big to show)`);
			} else {
				showStatus(`\u2514\u2500 ${file.path} ${text.toString()}`);
			}
			showStatus(`Preview: https://ipfs.io/ipfs/${file.cid}`, COLORS.success);
		};

		addBtn.onclick = async (e) => {
			e.preventDefault();
			let name = fileName.value;
			let content = fileContent.value;

			try {
				if (name == null || name.trim() === "") {
					showStatus("Set default name", COLORS.active);
					name = "test.txt";
				}

				if (content == null || content.trim() === "") {
					showStatus("Set default content", COLORS.active);
					content = "Hello world!";
				}

				await store(name, file ? file : content);
			} catch (err: any) {
				showStatus(err.message, COLORS.error);
			}
		};
	});

	const onFileSelected = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		let image = e.currentTarget?.files?.item(0);
		if (!image) return;

		fileName.value = image.name;

		let reader = new FileReader();
		reader.readAsArrayBuffer(image);
		reader.onload = (e) => {
			let res = e?.target?.result;
			if (!res) return;
			file = res;
			console.log(file);
		};
	};
</script>

<main>
	<h1>Add data to IPFS from the browser</h1>

	<form>
		<label for="file-name">Name</label>
		<input
			bind:this={fileName}
			name="file-name"
			type="text"
			placeholder="file.txt"
			required
		/>

		<input type="file" accept="*" on:change={(e) => onFileSelected(e)} />
		<!-- <label>Content</label>
		<input
			name="file-content"
			type="text"
			placeholder="Hello world"
			required
		/> -->

		<button bind:this={addBtn} type="submit"> Add file </button>
	</form>

	<h3 bind:this={output}>Output</h3>

	<div>
		<div />
		<div bind:this={terminal} />
	</div>
</main>
