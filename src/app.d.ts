import 'vite-plugin-pwa/pwa-assets';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'virtual:pwa-register' {
	import type { RegisterSWOptions } from 'vite-plugin-pwa/types'
  
	export type { RegisterSWOptions }
  
	export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}



export {};
