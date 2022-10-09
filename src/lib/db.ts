import { browser } from "$app/environment";
import Dexie, { type Table } from "dexie";
import { ipfs } from "./ipfs";

export interface ISong {
	id?: number;
	title: string;
	author: string;
	cid: string;
	duration?: number;
}

export class MyDexie extends Dexie {
	songs!: Table<ISong, number>;

	constructor() {
		super("dexie-spotifds");
		this.version(2).stores({
			songs: "++id, title, author, cid, duration",
		});

		this.on("populate", async () => {
			await this.songs.add({
				title: "Billie Jean",
				author: "Michael Jackson",
				cid: "QmVqUWigstymTeWgf6YcEecE6HXiAUsoAZ9aLEE77qcVnH",
			});
		});
	}
}

export const db = new MyDexie();

if (browser) {
	db.songs.hook("deleting", (key, song) => {
		ipfs?.pin.rm(song.cid);
	});
}
