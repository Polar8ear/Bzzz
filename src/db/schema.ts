import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle'

import mysql from 'mysql2/promise'
import { mysqlTable, varchar, datetime } from 'drizzle-orm/mysql-core'
import { drizzle } from 'drizzle-orm/mysql2'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '$env/static/private'

const connection = await mysql.createConnection({
	host: DB_HOST,
	port: parseInt(DB_PORT),
	password: DB_PASSWORD,
	database: DB_DATABASE,
	user: DB_USER,
})

const db = drizzle(connection)

export const userTable = mysqlTable('user', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
})

export const sessionTable = mysqlTable('session', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 255,
	})
		.notNull()
		.references(() => userTable.id),
	expiresAt: datetime('expires_at').notNull(),
})

const adapter = new DrizzleMySQLAdapter(db, sessionTable, userTable)
export { adapter, db }
