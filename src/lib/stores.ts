import type { ISong } from "./db";
import { useLocalStorageStore } from "./utils";

export let currentlyPlayingSong = useLocalStorageStore<ISong | null>(
	"currentlyPlayingSong",
	null
);
