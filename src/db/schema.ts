import { relations } from 'drizzle-orm'
import { mysqlTable, varchar, datetime, primaryKey } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('user', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
})

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	oAuthAccounts: many(oAuthAccounts),
}))

export const sessions = mysqlTable('session', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 255,
	})
		.notNull()
		.references(() => users.id),
	expiresAt: datetime('expires_at').notNull(),
})

export const oAuthAccounts = mysqlTable(
	'oauth_account',
	{
		providerId: varchar('provider_id', {
			length: 255,
		}),
		providerUserId: varchar('provider_user_id', {
			length: 255,
		}),
		userId: varchar('user_id', {
			length: 255,
		})
			.notNull()
			.references(() => users.id),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
		}
	},
)
