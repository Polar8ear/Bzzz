import type { Config } from 'drizzle-kit'

//get env and throw if null
const getEnv = (key: string): string => {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Missing env var: ${key}`)
	}
	return value
}

export default {
	schema: './src/db/schema.ts',
	out: './.drizzle',
	driver: 'mysql2',
	dbCredentials: {
		port: parseInt(getEnv('DB_PORT')),
		host: getEnv('DB_HOST'),
		user: getEnv('DB_USER'),
		password: getEnv('DB_PASSWORD'),
		database: getEnv('DB_DATABASE'),
	},
} satisfies Config
