import { browser } from "$app/environment";
import { create, type IPFS } from "ipfs-core";

export let ipfs: IPFS | undefined;

(async () => {
	if (browser)
		ipfs = await create({
			repo: "spotifds", //String(Math.random() + Date.now()),
			init: { algorithm: "Ed25519" },
			start: browser
		});
})();
