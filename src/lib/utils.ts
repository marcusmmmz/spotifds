import { browser } from "$app/environment";
import { liveQuery, type PromiseExtended } from "dexie";
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
