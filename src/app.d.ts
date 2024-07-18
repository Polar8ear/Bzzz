import 'vite-plugin-pwa/pwa-assets'
import 'unplugin-icons/types/svelte'
import '@types/dom-view-transitions'

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
			locale: string
		}
	}
}

export {}
