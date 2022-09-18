<script lang="ts">
	import type { ISong } from "$lib/types";
	import "./player.css";

	let song: ISong = {
		title: "Billie Jean",
		author: "Michael Jackson",
		cid: "QmVqUWigstymTeWgf6YcEecE6HXiAUsoAZ9aLEE77qcVnH",
	};

	let volume = 50;
	let paused = true;

	let audio: HTMLAudioElement;

	$: url = `https://ipfs.io/ipfs/${song.cid}`;

	$: if (audio) audio.volume = volume / 100;

	function play() {
		if (paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}
</script>

<audio bind:paused bind:this={audio} hidden src={url} />

<div class="playerBar">
	<h2>{song.title} - {song.author}</h2>
	<button on:click={play}>
		<img src={paused ? "/play.png" : "pause.png"} alt="pause/unpause" />
	</button>
	<input bind:value={volume} type="range" />
</div>
