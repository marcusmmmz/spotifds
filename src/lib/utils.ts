import { browser } from "$app/environment";
import { liveQuery, type PromiseExtended } from "dexie";
import { readable } from "svelte/store";

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
