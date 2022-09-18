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
	let progress = 0;

	let audio: HTMLAudioElement;
	let audioDuration = 0;
	let audioCurrentTime = 0;

	$: url = `https://ipfs.io/ipfs/${song.cid}`;

	$: if (audio) audio.volume = volume / 100;

	// let timeLeft = audio.duration - audio.currentTime;

	function play() {
		//  if (Math.random() > 0.1)
		//  	audio.src =
		//  		"https://ipfs.io/ipfs/QmVXazWNEERVNRoqKWJ2DWwyemKnbpPLMzgmFkQNfyb9u7";
		if (paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}

	let progressBarValue = 0;

	const calculateTime = (secs: number) => {
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${returnedSeconds}`;
	};

	function onTimeUpdate(
		e: Event & {
			currentTarget: EventTarget & HTMLAudioElement;
		}
	) {
		progressBarValue = (audio.currentTime / audio.duration) * 100;
		audioDuration = audio.duration;
		audioCurrentTime = audio.currentTime;
	}

	function onUpdateProgressBar(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		audio.currentTime = progressBarValue * 2.95; // Magic number
	}
</script>

<audio
	bind:paused
	bind:this={audio}
	on:timeupdate={(e) => onTimeUpdate(e)}
	hidden
	src={url}
/>

<div class="playerBar">
	<p>
		{calculateTime(audioCurrentTime)} ({calculateTime(audioDuration)})
	</p>
	<h2>{song.title} - {song.author}</h2>
	<button on:click={play}>
		<img src={paused ? "/play.png" : "pause.png"} alt="pause/unpause" />
	</button>
	<input class="volumeBar" bind:value={volume} type="range" />

	<input
		class="progressBar"
		type="range"
		bind:value={progressBarValue}
		on:input={onUpdateProgressBar}
	/>
</div>
