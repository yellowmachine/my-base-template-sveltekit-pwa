import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'
import { pwaConfiguration, replaceOptions } from './pwa-configuration.js'

const config = {
	plugins: [
		VitePWA(pwaConfiguration),
		replace(replaceOptions),
		sveltekit()
	]
};

export default config;
