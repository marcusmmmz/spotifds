<script lang="ts">
	import PlayerBar from "./PlayerBar.svelte";
	import LeftPanel from "./LeftPanel.svelte";
	import "./main.css";
	import CenterPanel from "./CenterPanel.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		let bullshitery = [
			"https://th.bing.com/th/id/OIP.77IIhfLwaAzhOfX5nmwdnAHaEo?w=269&h=180&c=7&r=0&o=5&pid=1.7",
			"https://th.bing.com/th/id/OIP.LK2A8uoNforf5EY9izvPFAHaEo?pid=ImgDet&rs=1",
			"https://th.bing.com/th/id/OIP.AME7Cgi-2Kfxnp0P7HnNCwHaEj?pid=ImgDet&rs=1",
			"https://th.bing.com/th/id/R.5488e1f58edf8bd4ec8ef54f4d336e0e?rik=blrc44hU%2fxSjHQ&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f11%2fCalm-Desktop-Wallpaper.jpg&ehk=O42tAazW0NSRe62Jd28E6hnRXnTqFe4GyL3ODEZXkzI%3d&risl=&pid=ImgRaw&r=0",
			"https://th.bing.com/th/id/R.fc09916fc5ac2b8febeb5d382584bcf6?rik=3ynl4nED76TuPw&riu=http%3a%2f%2fwallup.net%2fwp-content%2fuploads%2f2016%2f01%2f138160-nature-HDR-mountain-lake-reflection.jpg&ehk=6gv4h9%2b2YeO0YMi3DCpHyrR5YmYkM4i6%2f29Cp%2f2OeGo%3d&risl=&pid=ImgRaw&r=0",
			"https://th.bing.com/th/id/R.d3ce3e7685556b4a1fd2b418147c9e5c?rik=2OVEET80xyknZw&pid=ImgRaw&r=0",
			"https://th.bing.com/th/id/R.ae40bc52db661828763bb64fd39f5697?rik=0YHXq%2bsyReDxIQ&pid=ImgRaw&r=0",
			"https://th.bing.com/th/id/R.9ba4645d43b9fd9a8a845c18abdb62d8?rik=NAyZ%2bsMOALeHxg&riu=http%3a%2f%2fthewowstyle.com%2fwp-content%2fuploads%2f2015%2f04%2f786950-desktop-backgrounds.jpg&ehk=RKK6cMAjdK2kWM4E9DHmojRFsQBMDxOEMwyJEHinHqk%3d&risl=&pid=ImgRaw&r=0",
			"https://wallpapertag.com/wallpaper/full/c/4/b/472593-peaceful-desktop-wallpaper-2560x1600-for-mac.jpg",
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
	<CenterPanel />
</div>

<PlayerBar />
