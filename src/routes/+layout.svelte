<script lang="ts">
	import PlayerBar from "./PlayerBar.svelte";
	import LeftPanel from "./LeftPanel.svelte";
	import "./main.css";
</script>

<svelte:head>
	<title>Spotifds</title>
</svelte:head>

<div class="container">
	<div class="main">
		<slot />
	</div>
	<LeftPanel />

	<PlayerBar />
</div>

<style>
	.container {
		display: grid;
		flex-direction: column;
		grid-template-areas:
			"panel main"
			"player player";
		grid-template-columns: 250px auto;
		grid-template-rows: auto 100px;
		height: 100%;
	}

	.main {
		padding-left: 25px;
		padding-right: 25px;
		grid-area: main;
		background-color: var(--primary-foreground-color);
		background-image: linear-gradient(
			var(--primary-foreground-color) 0%,
			var(--secondary-foreground-color) 100%
		);
		overflow: scroll;
		overflow-x: hidden;
	}

	.main::-webkit-scrollbar-track {
		background-color: var(--primary-background-color);
	}

	.main::-webkit-scrollbar {
		width: 15px;
	}

	.main::-webkit-scrollbar-thumb {
		background-color: #7b6991;
	}
</style>
