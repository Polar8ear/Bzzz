import { relations } from 'drizzle-orm'
import {
	pgTable,
	varchar,
	timestamp,
	char,
	point,
	unique,
	type AnyPgColumn,
} from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'

const createdAt = timestamp('created_at').notNull().defaultNow()
const updatedAt = timestamp('updated_at')
	.notNull()
	.defaultNow()
	.$onUpdateFn(() => new Date())

const createdAtUpdatedAt = {
	createdAt,
	updatedAt,
}

const id = (name: string) =>
	char(name, {
		length: 26,
	})

const primaryId = id('id')
	.primaryKey()
	.$defaultFn(() => ulid())

export const addreses = pgTable('addresses', {
	id: primaryId,
	belongTo: id('belong_to'),
	belongToType: varchar('belong_to_type', {
		length: 16,
		enum: ['user', 'service_provider'],
	}),
	line1: varchar('line_1', {
		length: 255,
	}).notNull(),
	line2: varchar('line_2', {
		length: 255,
	}),
	line3: varchar('line_3', {
		length: 255,
	}),
	city: varchar('city', {
		length: 255,
	}).notNull(),
	postcode: varchar('postcode', {
		length: 255,
	}).notNull(),
	state: varchar('state', {
		length: 255,
	}).notNull(),
	coordinate: point('coordinate', {
		mode: 'xy',
	}).notNull(),
	...createdAtUpdatedAt,
})

export const addressesRelation = relations(addreses, ({ one }) => ({
	user: one(users, {
		fields: [addreses.belongTo],
		references: [users.id],
	}),

	serviceProvider: one(serviceProviders, {
		fields: [addreses.belongTo],
		references: [serviceProviders.id],
	}),
}))

export interface DatabaseUserAttributes {
	email: string
	emailVerifiedAt?: Date
	fullName?: string
}

export const users = pgTable('users', {
	id: primaryId,
	email: varchar('email', {
		length: 255,
	}).unique(undefined, {
		nulls: 'not distinct',
	}),
	password: varchar('password', {
		length: 255,
	}),
	fullName: varchar('full_name', {
		length: 255,
	}),
	contactNumber: varchar('contact_number', {
		length: 255,
	}),
	emailVerifiedAt: timestamp('email_verified_at'),
	defaultAddressId: id('default_address_id').references((): AnyPgColumn => addreses.id),
	...createdAtUpdatedAt,
})

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	oAuthAccounts: many(oAuthAccounts),
}))

export const emailVerificationTokens = pgTable('email_verification_tokens', {
	id: varchar('id', { length: 16 }).primaryKey(),
	userId: id('user_id')
		.references(() => users.id)
		.notNull(),
	expiresAt: timestamp('expires_at').notNull(),
})

export const serviceProviders = pgTable('service_providers', {
	id: primaryId,
	ownedBy: id('owned_by')
		.references(() => users.id)
		.notNull(),
	availability: varchar('availability', {
		length: 16,
		enum: ['available', 'not_available'],
	}),
	address: id('address_id').notNull(),
	...createdAtUpdatedAt,
})

export const sessions = pgTable('sessions', {
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
	'oauth_accounts',
	{
		id: primaryId,
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
		createdAt,
	},
	(table) => {
		return {
			uniqueProviderIdProviderUserId: unique().on(table.providerId, table.providerUserId),
		}
	},
)

export const oAuthAccountRelations = relations(oAuthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oAuthAccounts.userId],
		references: [users.id],
	}),
}))
