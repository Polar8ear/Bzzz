const debug = (...args: unknown[]) => {
	console.log(...args)
}

const info = (...args: unknown[]) => {
	console.info(...args)
}

const warn = (...args: unknown[]) => {
	console.warn(...args)
}

const error = (...args: unknown[]) => {
	console.error(...args)
}

const critical = (...args: unknown[]) => {
	console.error(...args)
}

const alert = (...args: unknown[]) => {
	console.error(...args)
}

export const log = {
	debug,
	info,
	warn,
	error,
	critical,
	alert,
}
