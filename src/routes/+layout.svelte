<script lang="ts">
	import PlayerBar from "./PlayerBar.svelte";
	import LeftPanel from "./LeftPanel.svelte";
	import "./main.css";
	import { onMount } from "svelte";

	onMount(() => {
		let bullshitery = [
			"https://wallpapercave.com/dwp1x/wp5984922.jpg",
			"https://wallpapercave.com/dwp1x/wp4469578.jpg",
			"https://wallpapercave.com/dwp1x/wp5156508.jpg",
		];
		let index = Math.floor(Math.random() * bullshitery.length);

		document.body.style.backgroundImage = `url(${bullshitery[index]})`;
	});
</script>

<svelte:head>
	<title>Spotifds</title>
</svelte:head>

<div class="blurPanel">
	<LeftPanel />
	<div class="mainFds">
		<slot />
	</div>
</div>

<PlayerBar />
