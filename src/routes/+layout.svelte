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
		grid-template-rows: 6fr 1fr;
		height: 100%;
	}

	.blurPanel {
		width: 100%;
		min-height: 100%;
		backdrop-filter: blur(12px);

		display: flex;
	}

	.main {
		width: 75%;
		height: 95%;
		padding: 25px 25px;
		background-color: rgba(54, 54, 54);
		border-left: 1px solid rgba(32, 32, 32);
	}
</style>
