<script lang="ts">
	import { db } from '$lib/db';
	import { currentlyPlayingSong, isPaused } from '$lib/stores';
	import { currentlyPlayingSong as song } from '$lib/stores';
	import { useLocalStorageStore } from '$lib/utils';
	import { onMount } from 'svelte';

	let volume = useLocalStorageStore('volume', 50);
	let paused = true;

	let audio: HTMLAudioElement;
	let duration = 0;
	let currentTime = 0;

	let progressBarEl: HTMLInputElement;
	let volumeBarEl: HTMLInputElement;

	let bubbleEl: HTMLElement;

	$: if (audio) audio.volume = $volume / 100;

	$: if (audio && !$isPaused && $currentlyPlayingSong != null) {
		const cb = () => {
			audio.play();
			audio.removeEventListener('canplaythrough', cb);
		};

		audio.addEventListener('canplaythrough', cb);
	}

	$: if ($volume) volumeBarEl?.style.setProperty('--value', $volume.toString());
	$: if (currentTime)
		progressBarEl.style.setProperty('--value', currentTime.toString());

	const calculateTime = (secs: number) => {
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${returnedSeconds}`;
	};

	function move(e: MouseEvent) {
		const toMove = e.clientX - bubbleEl.offsetWidth / 2 + 15;
		if (toMove > 16 && toMove < window.innerWidth - 16) {
			bubbleEl.style.left = toMove + 'px';
		}
	}

	function bubbleMove(e: MouseEvent) {
		move(e);

		const secs = (e.clientX / window.innerWidth) * duration;
		bubbleEl.innerText = calculateTime(secs);
	}

	function bubbleShow(e: MouseEvent) {
		move(e);
		bubbleEl.style.opacity = '1';
	}

	function bubbleHide() {
		bubbleEl.style.opacity = '0';
	}

	onMount(() => {
		audio.addEventListener('canplaythrough', (e) => {
			audio.play();
		});

		volumeBarEl.style.setProperty('--value', $volume.toString());
		volumeBarEl.style.setProperty('--min', '0');
		volumeBarEl.style.setProperty('--max', '100');

		progressBarEl.style.setProperty('--value', currentTime.toString());
		progressBarEl.style.setProperty('--min', '0');
	});

	async function playNextSong() {
		let nextSong = await db.songs
			.where('id')
			.above($currentlyPlayingSong?.id)
			.first();

		if (!nextSong) nextSong = await db.songs.orderBy('id').first();

		if (!nextSong) return;

		$currentlyPlayingSong = nextSong;
		$isPaused = false;
	}

	async function playBackSong() {
		let nextSong = await db.songs
			.where('id')
			.below($currentlyPlayingSong?.id)
			.last();

		if (!nextSong) nextSong = await db.songs.orderBy('id').last();

		if (!nextSong) return;

		$currentlyPlayingSong = nextSong;
		$isPaused = false;
	}
</script>

<div class="bottomBar">
	<div class="range-wrap">
		<div class="range-value"><span bind:this={bubbleEl} /></div>
		<input
			class="progressBar styled-slider slider-progress"
			type="range"
			min="0"
			max={duration}
			bind:this={progressBarEl}
			bind:value={currentTime}
			on:input={() => (audio.currentTime = currentTime)}
			on:mousemove={bubbleMove}
			on:mouseenter={bubbleShow}
			on:mouseleave={bubbleHide}
		/>
	</div>

	<audio
		bind:paused
		bind:this={audio}
		on:timeupdate={() => {
			currentTime = audio.currentTime;

			progressBarEl.style.setProperty('--value', currentTime.toString());
		}}
		on:durationchange={() => {
			duration = audio.duration;

			progressBarEl.max = duration.toString();
			progressBarEl.style.setProperty('--max', duration.toString());
		}}
		on:ended={playNextSong}
		hidden
		src={$song ? `https://ipfs.io/ipfs/${$song.cid}` : undefined}
	/>
	<div class="music-name-container">
		<div class="shadow" />
		<h2>{$song?.title ?? 'Nothing'}</h2>
		<h3>{$song?.author ?? 'playing'}</h3>
	</div>
	<div class="time-and-pause-container">
		<p>{calculateTime(currentTime)}</p>
		<button on:click={playBackSong}>
			<img style="transform: scale(0.75)" src="back.svg" alt="back" />
		</button>
		<button on:click={() => (paused ? audio.play() : audio.pause())}>
			<img
				class="svg"
				src={paused ? 'play.svg' : 'pause.svg'}
				alt="pause/unpause"
			/>
		</button>
		<button on:click={playNextSong}>
			<img style="transform: scale(0.75)" src="next.svg" alt="next" />
		</button>
		<p>
			{calculateTime(duration || 0)}
		</p>
	</div>
	<input
		class="volumeBar styled-slider slider-progress"
		bind:this={volumeBarEl}
		bind:value={$volume}
		type="range"
	/>
</div>

<style>
	.bottomBar {
		grid-area: player;
		height: 100%;
		background-color: #120816;
		display: grid;
		grid-template-areas:
			'progress progress progress'
			'name button volume';
		grid-template-columns: 3fr 1fr 3fr;
		height: 100%;
		width: 100%;
	}

	.range-wrap {
		grid-area: progress;
		align-self: start;
		height: 0px;
	}

	.range-value span {
		width: 30px;
		height: 24px;
		line-height: 24px;
		text-align: center;
		background: #9c03f4;
		color: #fff;
		font-size: 12px;
		display: block;
		transform: translate(-50%, 0);
		border-radius: 6px;
		bottom: 100px;
		position: absolute;
		margin-bottom: 15px;
		opacity: 0;
	}
	.range-value span:before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-top: 10px solid #9c03f4;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		margin-top: -1px;
	}

	.progressBar {
		width: 100%;
		margin: 0;
		position: relative;
		top: -5px;
	}

	.music-name-container {
		grid-area: name;
		text-align: left;
		margin-left: 10px;
		justify-self: start;
		align-self: center;
		width: 90%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.music-name-container h2 {
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 1) 80%,
			rgba(225, 255, 255, 0) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 10;
		margin-bottom: 0px;
	}

	.music-name-container h3 {
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.5) 80%,
			rgba(225, 255, 255, 0) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: rgba(255, 255, 255, 0.5);
		margin-top: 0px;
	}

	.time-and-pause-container {
		grid-area: button;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
		place-self: center;
	}

	img {
		width: 32px;
		height: 32px;
	}

	button {
		background-color: transparent;
		border: 0px;
		width: 45px;
		height: 64px;
		transition: 0.3s;
	}

	button:hover {
		cursor: pointer;
		filter: brightness(50%);
	}

	button:active {
		filter: invert(14%) sepia(100%) saturate(4370%) hue-rotate(281deg)
			brightness(75%) contrast(107%);
	}

	.volumeBar {
		grid-area: volume;
		width: 125px;
		margin: 25px;
		justify-self: end;
		align-self: center;
	}

	.volumeBar,
	.progressBar {
		cursor: pointer;
		background-color: transparent;
		-webkit-appearance: none;
		height: 14px;
		--range: calc(var(--max) - var(--min));
		--ratio: calc((var(--value) - var(--min)) / var(--range));
		--sx: calc(0.5 * 2em + var(--ratio) * (100% - 2em));
	}

	/*firefox*/
	.progressBar::-moz-range-track,
	.volumeBar::-moz-range-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		background: #50555c;
		border: 0px;
	}
	.progressBar::-moz-range-thumb,
	.volumeBar::-moz-range-thumb {
		box-shadow: 0px;
		border: 0px;
		height: 10px;
		width: 30px;
		border-radius: 12px;
		background: rgb(173, 129, 209);
		cursor: ew-resize;
	}
	.progressBar::-moz-range-progress,
	.volumeBar::-moz-range-progress {
		height: 10px;
		background: linear-gradient(90deg, #2b0b80 0%, #820ab3 35%, #e20ea1 100%);
	}
	.volumeBar::-moz-range-track,
	.volumeBar::-moz-range-progress {
		border-radius: 10px;
	}

	/*webkit*/
	.progressBar::-webkit-slider-thumb,
	.volumeBar::-webkit-slider-thumb {
		-webkit-appearance: none;
		box-shadow: 0px;
		border: 0px;
		height: 10px;
		width: 30px;
		border-radius: 12px;
		background: rgb(173, 129, 209);
		cursor: ew-resize;
	}

	.progressBar::-webkit-slider-runnable-track,
	.volumeBar::-webkit-slider-runnable-track {
		background: linear-gradient(to right, #2b0b80 0%, #820ab3 35%, #e20ea1 100%)
				0 / var(--sx) 100% no-repeat,
			#50555c;
		width: 100%;
		height: 10px;
		cursor: pointer;
		border: 0px;
	}

	.volumeBar::-webkit-slider-runnable-track {
		border-radius: 10px;
	}
</style>
