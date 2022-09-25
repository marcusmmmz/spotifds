<script lang="ts">
	import PlayerBar from "./PlayerBar.svelte";
	import LeftPanel from "./LeftPanel.svelte";
	import "./main.css";
	import { onMount } from "svelte";

	onMount(() => {
		let backgroundImages = [
			"https://wallpapercave.com/dwp1x/wp5984922.jpg",
			"https://wallpapercave.com/dwp1x/wp4469578.jpg",
			"https://wallpapercave.com/dwp1x/wp5156508.jpg",
		];
		let index = Math.floor(Math.random() * backgroundImages.length);

		document.body.style.backgroundImage = `url(${backgroundImages[index]})`;
	});
</script>

<svelte:head>
	<title>Spotifds</title>
</svelte:head>

<div class="container">
	<div class="blurPanel">
		<LeftPanel />
		<div class="main">
			<slot />
		</div>
	</div>

	<PlayerBar />
</div>

<style>
	.container {
		display: grid;
		flex-direction: column;
		grid-template-areas:
			"blur blur"
			"player player";
		grid-template-columns: 1fr 3fr;
		grid-template-rows: auto 100px;
		height: 100%;
	}

	.blurPanel {
		width: 100%;
		min-height: 100%;
		grid-area: blur;
		backdrop-filter: blur(12px);

		display: flex;
	}

	.main {
		width: 100%;
		height: 100%;
		padding: 0 25px;
		grid-area: main;
		background-color: var(--primary-background-color);
		border-left: 1px solid rgba(32, 32, 32);
	}
</style>
