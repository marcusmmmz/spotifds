<div class="left">
	<h1>Spotifds</h1>
	<div class="menuSelector">
		<a href="/">Main Page</a>
		<a href="/manage">Manage</a>
	</div>
</div>

<style>
	.left {
		width: 25%;
		max-width: 25%;
		padding: 25px 25px;
	}

	.left a,
	h1 {
		text-shadow: 2px 2px 2px #000000;
	}

	.menuSelector {
		display: flex;
		flex-direction: column;
	}

	.menuSelector a {
		text-decoration: none;
		font-size: 22px;
		color: #ffffff;
		transition: 0.3s;
		padding: 8px 8px;
	}

	.menuSelector a:hover {
		transition: 0.3s;
		background-color: rgba(255, 255, 255, 0.3);
	}
</style>
