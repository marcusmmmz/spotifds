<script lang="ts">
	import type { ISong } from "./db";
	import { currentlyPlayingSong } from "./stores";
	import { calculateTime } from "$lib/utils";

	export let song: ISong;

	$: isCurrentlyPlaying = song.cid == $currentlyPlayingSong?.cid;
</script>

<div class="song" on:click on:contextmenu>
	<div class="image">
		<img
			src={isCurrentlyPlaying ? "/play.svg" : "/quavers-pair.svg"}
			alt="back"
		/>
	</div>
	<div class="title">
		<h2>{song.title}</h2>
	</div>
	<div class="author">
		<h2>{song.author}</h2>
	</div>
	<div class="time">
		<h3>{calculateTime(song.duration)}</h3>
	</div>
</div>

<style>
	.song {
		background-color: var(--primary-background-color);
		margin-bottom: 5px;
		display: grid;
		grid-template-areas:
			"icon title title"
			"icon autor duration";
		grid-template-columns: 75px auto 75px;
		grid-template-rows: 40px 40px;
		color: rgb(202, 202, 202);
		text-overflow: clip;
	}

	.song:hover {
		cursor: pointer;
		color: white;
	}

	.image {
		grid-area: icon;
		width: 100%;
		height: 100%;
	}

	.song .image {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	img {
		object-fit: scale-down;
		width: 75%;
		height: 75%;
	}

	.title {
		grid-area: title;
		height: 100%;
		width: calc(100% - 10px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		align-self: center;
	}

	.title h2 {
		font-size: 30px;
		margin-right: 10px;
		margin-top: 8px;
		text-overflow: ellipsis;
	}

	.author {
		height: 100%;
		grid-area: autor;
	}

	.author h2 {
		font-size: 17px;
		margin-top: 8px;
	}

	.time {
		grid-area: duration;
	}

	.time h3 {
		margin-top: 8px;
	}
</style>
