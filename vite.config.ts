import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [sveltekit()],
	build: {
		target: "es2020",
	},
	define: {
		global: "globalThis",
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "es2020",
		},
	},
};

export default config;
