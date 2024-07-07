import 'vite-plugin-pwa/pwa-assets'
import 'unplugin-icons/types/svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string
			errorId?: string
			originalErrorStack?: string
		}
		// interface Locals {}
		interface PageData {
			user: import('lucia').User | null
		}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user: import('lucia').User | null
			session: import('lucia').Session | null
		}
	}
}

declare module 'virtual:pwa-register' {
	import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

	export type { RegisterSWOptions }

	export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}

export {}
