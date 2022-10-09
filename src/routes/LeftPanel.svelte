<div class="left">
	<div class="menuSelector">
		<a href="/">Main Page</a>
		<a href="/manage">Manage</a>
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
		margin-left: 10px;
	}

	.menuSelector a {
		text-decoration: none;
		font-size: 22px;
		color: #ffffff;
		transition: 0.3s;
		padding-bottom: 10px;
	}

	.menuSelector a:hover {
		transition: 0.3s;
		padding-left: 10px;
	}


	.menuSelector a:active {
		color: var(--yellow);
		position: relative;
		top: 2px;
		transition: 0s;
		text-shadow: 0 0 3px var(--yellow), 0 0 5px var(--yellow), 0 0 8px var(--yellow),
			0 0 18px var(--orange), 0 0 30px var(--orange), 0 0 34px var(--orange),
			0 0 40px var(--orange), 0 0 65px var(--orange);
	}
</style>
