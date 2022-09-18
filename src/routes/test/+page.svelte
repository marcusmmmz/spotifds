<script lang="ts">
	import { db, type ISong } from "$lib/db";
	import { useLiveQuery } from "$lib/utils";

	let songId: ISong["id"];

	let songs = useLiveQuery(() => db.songs.toArray(), []);
</script>

<button
	on:click={async () => {
		songId = await db.songs.add({
			title: "a",
			author: "b",
			cid: "c",
		});
	}}>add</button
>

<button
	on:click={() => {
		db.songs.update(songId ?? NaN, {
			title: "aa",
		});
	}}>update</button
>

<button
	on:click={() => {
		db.songs.delete(songId ?? NaN);
	}}>delete</button
>

<ul>
	{#if $songs}
		{#each $songs as song (song.id)}
			<li>{song.title} - {song.author}</li>
		{/each}
	{/if}
</ul>
