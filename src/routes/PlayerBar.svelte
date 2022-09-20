<script lang="ts">
	import { currentlyPlayingSong as song } from "$lib/stores";
	import { useLocalStorageStore } from "$lib/utils";
	import { onMount } from "svelte";

	let volume = useLocalStorageStore("volume", 50);
	let paused = true;

	let audio: HTMLAudioElement;
	let duration = 0;
	let currentTime = 0;

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
</script>

<div class="bottomBar">
	<input
		class="progressBar"
		type="range"
		min="0"
		max={duration}
		bind:value={currentTime}
		on:input={() => {
			audio.currentTime = currentTime;
		}}
	/>

	<div class="playerBar">
		<audio
			bind:paused
			bind:this={audio}
			on:timeupdate={() => {
				currentTime = audio.currentTime;
			}}
			on:durationchange={() => {
				duration = audio.duration;
			}}
			hidden
			src={$song ? `https://ipfs.io/ipfs/${$song.cid}` : undefined}
		/>
		<h2>{$song?.title ?? "Nothing"} - {$song?.author ?? "playing"}</h2>
		<div class="time-and-pause-container">
			<p>{calculateTime(currentTime)}</p>
			<button on:click={() => (paused ? audio.play() : audio.pause())}>
				<img src={paused ? "/play.svg" : "pause.svg"} alt="pause/unpause" />
			</button>
			<p>
				{calculateTime(duration || 0)}
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
