import Dexie, { type Table } from "dexie";

export interface ISong {
	id?: number;
	title: string;
	author: string;
	cid: string;
}

export class MyDexie extends Dexie {
	songs!: Table<ISong, number>;

	constructor() {
		super("dexie-spotifds");
		this.version(1).stores({
			songs: "++id, title, author, cid",
		});
	}
}

export const db = new MyDexie();
