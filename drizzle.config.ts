import type { Config } from 'drizzle-kit'

//a function to enforce that environment exist and throw if not found
const getEnv = (key: string): string => {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Environment variable ${key} not found`)
	}
	return value
}

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './.drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		database: getEnv('DB_DATABASE'),
		port: Number.parseInt(getEnv('DB_PORT')),
		host: getEnv('DB_HOST'),
		user: getEnv('DB_USER'),
		password: getEnv('DB_PASSWORD'),
	},
} satisfies Config
