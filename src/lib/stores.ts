import { writable } from "svelte/store";
import type { ISong } from "./db";
import { useLocalStorageStore } from "./utils";

export let isPaused = writable(true);

export let currentlyPlayingSong = useLocalStorageStore<ISong | null>(
	"currentlyPlayingSong",
	null
);
