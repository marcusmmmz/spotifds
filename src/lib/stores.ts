import { writable } from "svelte/store";
import type { ISong } from "./db";

export let currentlyPlayingSong = writable<ISong>({
	title: "Billie Jean",
	author: "Michael Jackson",
	cid: "QmVqUWigstymTeWgf6YcEecE6HXiAUsoAZ9aLEE77qcVnH",
});
