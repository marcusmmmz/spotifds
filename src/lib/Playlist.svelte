<script lang="ts">
	import type { IPlaylist } from "$lib/db";

	export let playlist: IPlaylist;
</script>

<div class="playlist" on:click on:contextmenu>
	<img src="/playlist.svg" alt="playlist" />
	<h2>{playlist.title}</h2>
</div>

<style>
	.playlist {
		background-color: var(--primary-background-color);
		margin: 2px;
		color: rgb(202, 202, 202);
		text-overflow: clip;

		display: flex;
		height: 40px;
		width: 100%;
	}

	.playlist:hover {
		cursor: pointer;
		color: white;
	}

	img {
		margin-right: 10px;
	}

	h2 {
		height: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		align-self: center;
		font-size: 30px;

		margin: 0;
	}
</style>
