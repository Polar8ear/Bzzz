import { relations } from 'drizzle-orm'
import { pgTable, varchar, timestamp, primaryKey, uuid, char } from 'drizzle-orm/pg-core'
import {} from 'drizzle-orm/mysql-core'
import { ulid } from 'ulid'

export const users = pgTable('user', {
	id: char('id', {
		length: 26,
	})
		.primaryKey()
		.$defaultFn(() => ulid()),
})

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	oAuthAccounts: many(oAuthAccounts),
}))

export const sessions = pgTable('session', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	userId: char('user_id', {
		length: 26,
	})
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at').notNull(),
})

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}))

export const oAuthAccounts = pgTable(
	'oauth_account',
	{
		providerId: varchar('provider_id', {
			length: 255,
		}),
		providerUserId: varchar('provider_user_id', {
			length: 255,
		}),
		userId: char('user_id', {
			length: 26,
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

export const oAuthAccountRelations = relations(oAuthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oAuthAccounts.userId],
		references: [users.id],
	}),
}))
