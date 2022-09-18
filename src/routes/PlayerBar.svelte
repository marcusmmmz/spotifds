<script lang="ts">
	import { currentlyPlayingSong as song } from "$lib/stores";
	import { onMount } from "svelte";
	import "./player.css";

	let volume = 50;
	let paused = true;

	let audio: HTMLAudioElement;
	let audioDuration = 0;
	let audioCurrentTime = 0;

	$: progressBarValue = (audioCurrentTime / audioDuration) * 100;

	$: if (audio) audio.volume = volume / 100;

	onMount(() => {
		audio.addEventListener("canplaythrough", (e) => {
			audio.play();
		});
	});

	const calculateTime = (secs: number) => {
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${returnedSeconds}`;
	};

	function onTimeUpdate() {
		audioDuration = audio.duration;
		audioCurrentTime = audio.currentTime;
	}

	function onUpdateProgressBar() {
		audio.currentTime = progressBarValue * 2.95; // Magic number
	}
</script>

<audio
	bind:paused
	bind:this={audio}
	on:timeupdate={onTimeUpdate}
	hidden
	src={`https://ipfs.io/ipfs/${$song.cid}`}
/>

<div class="playerBar">
	<p>
		{calculateTime(audioCurrentTime)} ({calculateTime(audioDuration)})
	</p>
	<h2>{$song.title} - {$song.author}</h2>
	<button on:click={() => (paused ? audio.play() : audio.pause())}>
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
