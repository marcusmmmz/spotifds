<script lang="ts">
	import { db, type IPlaylistSong, type ISong } from "$lib/db";
	import { ipfs } from "$lib/ipfs";
	import { currentlyPlayingSong, currentPlaylist, isPaused } from "$lib/stores";
	import { currentlyPlayingSong as song } from "$lib/stores";
	import {
		calculateTime,
		useLiveQuery,
		useLocalStorageStore
	} from "$lib/utils";

	let volume = useLocalStorageStore("volume", 50);

	let audio: HTMLAudioElement;
	let duration = 0;
	let currentTime = 0;

	let progressBarEl: HTMLInputElement;
	let volumeBarEl: HTMLInputElement;

	let songBlob: Blob | undefined;

	$: if (audio) audio.volume = $volume / 100;

	$: if (audio && !$isPaused && $currentlyPlayingSong != null) {
		const cb = () => {
			audio.play();
			audio.removeEventListener("canplaythrough", cb);
		};

		audio.addEventListener("canplaythrough", cb);
	}

	$: songBlobUrl = songBlob ? URL.createObjectURL(songBlob) : undefined;

	$: volumeBarEl?.style?.setProperty("--value", $volume.toString());
	$: progressBarEl?.style?.setProperty("--value", currentTime.toString());

	$: if (progressBarEl) progressBarEl.max = duration.toString();
	$: progressBarEl?.style?.setProperty("--max", duration.toString());

	let allPlaylistSongs: IPlaylistSong[];
	$: if ($currentPlaylist?.id != undefined)
		updateSongsInPlaylist($currentPlaylist.id);

	$: currentPlaylistSong = useLiveQuery(
		() =>
			db.playlistSongs.get({
				songId: $currentlyPlayingSong?.id,
				playlistId: $currentPlaylist?.id
			}),
		undefined
	);

	async function loadSongFromGateway() {
		if (!$song) return;

		let res = await fetch(`https://ipfs.io/ipfs/${$song.cid}?filename=.mp3`);

		return await res.blob();
	}

	async function loadSongFromNode() {
		if (!$song || !ipfs) return;

		let chunks: Uint8Array[] = [];

		for await (const chunk of ipfs.cat($song.cid)) {
			chunks.push(chunk);
		}

		return new Blob(chunks);
	}

	async function loadSong() {
		songBlob = await Promise.any([loadSongFromNode(), loadSongFromGateway()]);
	}

	$: loadSong(), $song;

	async function updateSongsInPlaylist(currentPlaylistId: number) {
		allPlaylistSongs = await db.playlistSongs
			.where("playlistId")
			.equals(currentPlaylistId)
			.toArray();
	}

	function getHighestSongIndex(songsInPlaylist: IPlaylistSong[]) {
		return songsInPlaylist.reduce((pv, cv) => (cv.index > pv.index ? cv : pv));
	}

	function getLowestSongIndex(songsInPlaylist: IPlaylistSong[]) {
		return songsInPlaylist.reduce((pv, cv) => (cv.index < pv.index ? cv : pv));
	}

	async function playSong(song: ISong) {
		$currentlyPlayingSong = song;
		$isPaused = false;
	}

	async function playNextPlaylistSong() {
		if (!$currentPlaylistSong) return;

		let nextPlaylistSong: IPlaylistSong | undefined;

		if (allPlaylistSongs.length !== 0) {
			let currentPlaylistSongIndex = $currentPlaylistSong.index;

			let nextPlaylistSongs = allPlaylistSongs.filter(
				(playlistSong) => playlistSong.index > currentPlaylistSongIndex
			);

			if (nextPlaylistSongs.length == 0) {
				nextPlaylistSong = getLowestSongIndex(allPlaylistSongs);
			} else {
				nextPlaylistSong = getLowestSongIndex(nextPlaylistSongs);
			}
		}

		if (!nextPlaylistSong?.songId) return;

		let nextSong = await db.songs.get(nextPlaylistSong.songId);

		if (!nextSong) return;

		playSong(nextSong);
	}

	async function playNextSong() {
		if ($currentPlaylist != null) return playNextPlaylistSong();

		let nextSong = await db.songs
			.where("id")
			.above($currentlyPlayingSong?.id)
			.first();

		if (!nextSong) nextSong = await db.songs.orderBy("id").first();

		if (!nextSong) return;

		playSong(nextSong);
	}

	async function playPreviousPlaylistSong() {
		if (!$currentPlaylistSong) return;

		let previousPlaylistSong: IPlaylistSong | undefined;

		if (allPlaylistSongs.length !== 0) {
			let currentPlaylistSongIndex = $currentPlaylistSong.index;

			let nextPlaylistSongs = allPlaylistSongs.filter(
				(playlistSong) => playlistSong.index < currentPlaylistSongIndex
			);

			if (nextPlaylistSongs.length == 0) {
				previousPlaylistSong = getHighestSongIndex(allPlaylistSongs);
			} else {
				previousPlaylistSong = getHighestSongIndex(nextPlaylistSongs);
			}
		}

		if (!previousPlaylistSong?.songId) return;

		let nextSong = await db.songs.get(previousPlaylistSong.songId);

		if (!nextSong) return;

		playSong(nextSong);
	}

	async function playPreviousSong() {
		if ($currentPlaylist != null) return playPreviousPlaylistSong();

		let previousSong = await db.songs
			.where("id")
			.below($currentlyPlayingSong?.id)
			.last();

		if (!previousSong) previousSong = await db.songs.orderBy("id").last();

		if (!previousSong) return;

		playSong(previousSong);
	}
</script>

<div class="bottomBar">
	<div class="range-wrap">
		<input
			class="progressBar"
			type="range"
			min="0"
			max={duration}
			bind:this={progressBarEl}
			bind:value={currentTime}
			on:input={() => (audio.currentTime = currentTime)}
		/>
	</div>

	<audio
		bind:paused={$isPaused}
		bind:this={audio}
		on:timeupdate={() => {
			currentTime = audio.currentTime;
		}}
		on:durationchange={() => {
			duration = audio.duration;
		}}
		on:ended={playNextSong}
		hidden
		src={songBlobUrl}
	/>
	<div class="music-name-container">
		<h2>{$song?.title ?? "Nothing"}</h2>
		<h3>{$song?.author ?? "playing"}</h3>
	</div>
	<div class="time-and-pause-container">
		<p>{calculateTime(currentTime)}</p>
		<button on:click={playPreviousSong}>
			<img style="transform: scale(0.75)" src="/previous.svg" alt="back" />
		</button>
		<button on:click={() => ($isPaused ? audio.play() : audio.pause())}>
			<img
				class="svg"
				src={$isPaused ? "/play.svg" : "/pause.svg"}
				alt="pause/unpause"
			/>
		</button>
		<button on:click={playNextSong}>
			<img style="transform: scale(0.75)" src="/next.svg" alt="next" />
		</button>
		<p>
			{calculateTime(duration)}
		</p>
	</div>
	<input
		class="volumeBar"
		bind:this={volumeBarEl}
		bind:value={$volume}
		type="range"
	/>
</div>

<style>
	.bottomBar {
		grid-area: player;
		height: 100%;
		background-color: var(--primary-background-color);
		display: grid;
		grid-template-areas:
			"progress progress progress"
			"name button volume";
		grid-template-columns: 3fr 1fr 3fr;
		height: 100%;
		width: 100%;
	}

	.range-wrap {
		grid-area: progress;
		align-self: start;
		height: 0px;
	}

	.progressBar {
		width: 100%;
		margin: 0;
		position: relative;
		top: -5px;

		--range: calc(var(--max) - 0);
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
		--range: calc(100 - 0);
	}

	.volumeBar,
	.progressBar {
		cursor: pointer;
		background-color: transparent;
		-webkit-appearance: none;
		height: 14px;
		--ratio: calc((var(--value) - 0) / var(--range));
		--sx: calc(0.5 * 2em + var(--ratio) * (100% - 2em));
	}

	/*firefox*/
	.progressBar::-moz-range-track,
	.volumeBar::-moz-range-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		background: var(--range-background-color);
		border: 0px;
	}
	.progressBar::-moz-range-thumb,
	.volumeBar::-moz-range-thumb {
		box-shadow: 0px;
		border: 0px;
		height: 10px;
		width: 30px;
		border-radius: 12px;
		background: var(--range-thumb-color);
		cursor: ew-resize;
	}
	.progressBar::-moz-range-progress,
	.volumeBar::-moz-range-progress {
		height: 10px;
		background: var(--range-gradient);
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
		background: var(--range-thumb-color);
		cursor: ew-resize;
	}

	.progressBar::-webkit-slider-runnable-track,
	.volumeBar::-webkit-slider-runnable-track {
		background: var(--range-gradient) 0 / var(--sx) 100% no-repeat,
			var(--range-background-color);
		width: 100%;
		height: 10px;
		cursor: pointer;
		border: 0px;
	}

	.volumeBar::-webkit-slider-runnable-track {
		border-radius: 10px;
	}
</style>
