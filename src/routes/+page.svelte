<script lang="ts">
	import PlayerBar from "./PlayerBar.svelte";
	import LeftPanel from "./LeftPanel.svelte";
	import "./main.css";
	import CenterPanel from "./CenterPanel.svelte";
</script>

<svelte:head>
	<title>Spotifds</title>
</svelte:head>

<div class="blurPanel">
	<LeftPanel />
	<CenterPanel />
</div>

<PlayerBar />
