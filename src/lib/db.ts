import { browser } from "$app/environment";
import Dexie, { type Table } from "dexie";
import { ipfs } from "./ipfs";
import { filterUndefined } from "./utils";

export interface ISong {
	id?: number;
	title: string;
	author: string;
	cid: string;
	duration?: number;
}

export interface IPlaylist {
	id?: number;
	title: string;
}

export interface IPlaylistSong {
	index: number;
	playlistId: IPlaylist["id"];
	songId: ISong["id"];
}

export class MyDexie extends Dexie {
	songs!: Table<ISong, number>;
	playlists!: Table<IPlaylist, number>;
	playlistSongs!: Table<IPlaylistSong, [number, number]>;

	constructor() {
		super("dexie-spotifds");
		this.version(3).stores({
			songs: "++id, title, author, cid, duration",
			playlists: "++id, title",
			playlistSongs: "[playlistId+songId], songId, playlistId, index"
		});

		this.on("populate", async () => {
			await this.songs.add({
				title: "Billie Jean",
				author: "Michael Jackson",
				cid: "QmVqUWigstymTeWgf6YcEecE6HXiAUsoAZ9aLEE77qcVnH"
			});
		});
	}
}

export const db = new MyDexie();

if (browser) {
	db.songs.hook("deleting", (key, song) => {
		ipfs?.pin.rm(song.cid);
	});

	db.playlists.hook("deleting", async (key, playlist, tx) => {
		tx.on("complete", () => {
			if (!playlist.id) return;

			db.playlistSongs.where("playlistId").equals(playlist.id).delete();
		});
	});

	db.songs.hook("deleting", (key, song, tx) => {
		tx.on("complete", () => {
			if (!song.id) return;

			db.playlistSongs.where("songId").equals(song.id).delete();
		});
	});
}
