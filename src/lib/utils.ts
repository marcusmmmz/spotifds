import { browser } from "$app/environment";
import { liveQuery, type PromiseExtended } from "dexie";
import { getContext, setContext } from "svelte";
import { readable, writable, type Updater } from "svelte/store";

export function useLiveQuery<T extends any>(
	query: () => PromiseExtended<T>,
	defaultValue: T
) {
	if (!browser) return readable<T>(defaultValue);

	const _liveQuery = liveQuery(query);

	return {
		subscribe(callback: (value: T) => any) {
			const { unsubscribe } = _liveQuery.subscribe(callback);

			return unsubscribe;
		},
	};
}

export function useLocalStorageStore<T>(
	key: string,
	initialValue: T,
	serialize: (value: T) => string = JSON.stringify,
	deserialize: (value: string) => T = JSON.parse
) {
	if (!browser) return writable(initialValue);

	let serializedValue = localStorage.getItem(key);

	let store = writable(
		serializedValue == null ? initialValue : deserialize(serializedValue)
	);

	function save(value: T) {
		localStorage.setItem(key, serialize(value));
	}

	return {
		subscribe: store.subscribe,
		set(value: T) {
			store.set(value);
			save(value);
		},
		update(updater: Updater<T>) {
			store.update((value) => {
				save(value);
				return updater(value);
			});
		},
	};
}

export function defineContext<T>(): [() => T, (service: T) => T] {
	const key = Symbol();

	return [() => getContext<T>(key), (service: T) => setContext(key, service)];
}

export function calculateTime(secs?: number) {
	if (secs == undefined) return "--:--";

	const minutes = Math.floor(secs / 60);
	const seconds = Math.floor(secs % 60);
	const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${minutes}:${returnedSeconds}`;
}

export function filterUndefined<T>(arr: (T | undefined)[]) {
	return arr.filter((item) => item) as T[];
}
