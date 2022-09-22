import Dexie, { type Table } from "dexie";
import { ipfs } from "./ipfs";
import { currentlyPlayingSong } from "./stores";

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

db.songs.hook("deleting", (key, song) => {
	ipfs?.pin.rm(song.cid);
});
