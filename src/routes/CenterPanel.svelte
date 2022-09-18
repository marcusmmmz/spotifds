<script lang="ts">
	import type { ISong } from "$lib/types";

	let uploadedSongs: ISong[] = [
		{
			title: "Lol",
			author: "baba",
			cid: "nada",
		},
	];
</script>

<div class="mainFds">
	<h2>Uploaded Songs</h2>
	<div class="uploadedSongContent">
		<ul>
			{#each uploadedSongs as song}
				<li><img alt="" src="/tune.png" />{song.title} by {song.author}</li>
			{/each}
		</ul>
	</div>
</div>
