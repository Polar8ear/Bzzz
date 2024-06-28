import { dev } from '$app/environment'

export class Logger {
	private name: string

	constructor(name: string) {
		this.name = name
	}

	_prefix() {
		return `${new Date().toUTCString()} [${this.name}]`
	}

	debug(...args: unknown[]) {
		if (!dev) {
			return
		}
		console.log(this._prefix(), ...args)
	}

	info(...args: unknown[]) {
		console.info(this._prefix(), ...args)
	}

	warn(...args: unknown[]) {
		console.warn(this._prefix(), ...args)
	}

	error(...args: unknown[]) {
		console.error(this._prefix(), ...args)
	}

	critical(...args: unknown[]) {
		console.error(this._prefix(), ...args)
	}

	alert(...args: unknown[]) {
		console.error(this._prefix(), ...args)
	}
}

export const errorLogger = new Logger('error')
export const authLogger = new Logger('auth')

export const log = new Logger('general')
