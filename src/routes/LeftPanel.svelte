<script>
	import MenuDivider from "$lib/ContextMenu/MenuDivider.svelte";
	import MenuPlaylists from "./MenuPlaylists.svelte";
</script>

<div class="left">
	<div class="menuSelector">
		<a href="/">All songs</a>
		<a href="/manage">Manage</a>
		<hr />

		<MenuPlaylists />
	</div>
</div>

<style>
	.left {
		background-color: var(--primary-background-color);
		grid-area: panel;
		padding: 25px 25px;
		box-shadow: 0px 0px 5px black;
	}

	.left a {
		text-shadow: 2px 2px 2px #000000;
	}

	.menuSelector {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	hr {
		border: 0;
		border-top: 1px solid var(--accent-color);
		border-bottom: 1px solid var(--accent-color);
		width: 100%;
	}

	* :global(a) {
		text-decoration: none;
		font-size: 22px;
		color: #ffffff;
		transition: 0.3s;
		padding: 5px 0;
		margin-left: 10px;
	}

	* :global(a):hover {
		transition: 0.3s;
		padding-left: 10px;
	}

	* :global(a):active {
		position: relative;
		top: 2px;
	}
</style>
