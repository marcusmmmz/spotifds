import type { ISong } from "./db";
import { useLocalStorageStore } from "./utils";

export let currentlyPlayingSong = useLocalStorageStore<ISong>(
	"currentlyPlayingSong",
	{
		title: "Billie Jean",
		author: "Michael Jackson",
		cid: "QmVqUWigstymTeWgf6YcEecE6HXiAUsoAZ9aLEE77qcVnH",
	}
);
