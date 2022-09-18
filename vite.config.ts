import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [sveltekit()],
	build: {
		target: "es2020",
		minify: false,
		// disable @rollup/plugin-commonjs https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
		// should be removable with vite 4 https://vitejs.dev/blog/announcing-vite3.html#esbuild-deps-optimization-at-build-time-experimental
		commonjsOptions: {
			include: [],
		},
	},
	define: {
		"process.env.NODE_DEBUG": "false",
		global: "globalThis",
	},
	optimizeDeps: {
		disabled: false,
		esbuildOptions: {
			target: "es2020",
		},
	},
};

export default config;
