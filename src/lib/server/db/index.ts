import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } from '$env/static/private'

// postgres db client not using rds
const queryClient = postgres({
	database: DB_DATABASE,
	port: Number.parseInt(DB_PORT),
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
})

const db = drizzle(queryClient, { schema: schema })

export type DB = typeof db
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type DBorTransaction = DB | Transaction

const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessions, schema.users)

export { adapter, db }
