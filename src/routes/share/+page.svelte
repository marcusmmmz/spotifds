<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { db } from "$lib/db";
	import { ipfs } from "$lib/ipfs";

	const params = $page.url.searchParams;

	$: title = params.get("title") ?? "unknown";
	$: author = params.get("author") ?? "unknown";
	$: cid = params.get("cid");

	async function addSong() {
		if (!cid) return;

		await ipfs?.pin.add(cid);

		await db.songs.add({
			title,
			author,
			cid
		});

		goto("/");
	}
</script>

<h2>Do you want to add this song to your library?</h2>
<div class="container">
	<div class="add-song-container">
		<h3>
			{title} - {author}
		</h3>
		<button class="button" on:click={addSong}>Add song</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.add-song-container {
		display: flex;
		flex-direction: column;

		background-color: var(--secondary-background-color);
		width: 90%;
		padding: 2% 2%;
	}
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	button {
		/* width: 30%; */
	}
</style>
