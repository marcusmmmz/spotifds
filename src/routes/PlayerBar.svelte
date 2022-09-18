<script lang="ts">
	import { currentlyPlayingSong as song } from "$lib/stores";
	import { useLocalStorageStore } from "$lib/utils";
	import { onMount } from "svelte";

	let volume = useLocalStorageStore("volume", 50);
	let paused = true;

	let audio: HTMLAudioElement;
	let audioDuration = 0;
	let audioCurrentTime = 0;

	$: progressBarValue = (audioCurrentTime / audioDuration) * 100;

	$: if (audio) audio.volume = $volume / 100;

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

<div class="bottomBar">
	<input
		class="progressBar"
		type="range"
		bind:value={progressBarValue}
		on:input={onUpdateProgressBar}
	/>

	<div class="playerBar">
		<audio
			bind:paused
			bind:this={audio}
			on:timeupdate={onTimeUpdate}
			hidden
			src={`https://ipfs.io/ipfs/${$song.cid}`}
		/>
		<h2>{$song.title} - {$song.author}</h2>
		<div class="time-and-pause-container">
			<p>{calculateTime(audioCurrentTime)}</p>
			<button on:click={() => (paused ? audio.play() : audio.pause())}>
				<img src={paused ? "/play.svg" : "pause.svg"} alt="pause/unpause" />
			</button>
			<p>
				{calculateTime(audioDuration || 0)}
			</p>
		</div>
		<input class="volumeBar" bind:value={$volume} type="range" />
	</div>
</div>

<style>
	.playerBar {
		display: grid;
		grid-template-columns: 3fr 1fr 3fr;
		place-items: center;
		height: 100%;
		width: 100%;
		background-image: linear-gradient(
			rgba(173, 173, 173, 0.778),
			rgba(0, 0, 0, 0.779),
			rgba(0, 0, 0, 1)
		);
		backdrop-filter: blur(4px);
		color: white;
	}

	img {
		width: 32px;
		height: 32px;
		color: white;
	}

	button {
		background-color: rgba(180, 180, 180, 1);
		border: 2px solid rgb(1, 63, 235);
		border-radius: 100%;
		width: 64px;
		height: 64px;
		transition: 0.3s;
	}

	button:hover {
		transition: 0.3s;
		background-color: rgba(210, 210, 210, 1);
		border: 2px solid rgb(2, 26, 92);
		cursor: pointer;
	}

	.volumeBar {
		margin: 0;
		margin: 25px 0;
		color: blue;
	}

	.progressBar {
		margin: 0;
		position: relative;
		top: 4px;
		z-index: 1;
	}

	.bottomBar {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.progressBar::-webkit-slider-thumb,
	.progressBar::-moz-range-thumb {
		cursor: pointer;
	}

	.time-and-pause-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
	}
</style>
