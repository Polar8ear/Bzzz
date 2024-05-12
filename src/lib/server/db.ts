import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle'

import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '$env/static/private'
import * as schema from '$db/schema'

const connection = await mysql.createConnection({
	host: DB_HOST,
	port: parseInt(DB_PORT),
	password: DB_PASSWORD,
	database: DB_DATABASE,
	user: DB_USER,
})

const db = drizzle(connection, { schema, mode: 'default' })
const adapter = new DrizzleMySQLAdapter(db, schema.sessions, schema.users)

export { adapter, db }
