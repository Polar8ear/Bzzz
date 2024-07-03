import { relations, sql } from 'drizzle-orm'
import {
	pgTable,
	varchar,
	timestamp,
	char,
	point,
	unique,
	type AnyPgColumn,
	integer,
	text,
	jsonb,
	smallint,
	index,
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

export const userRelations = relations(users, ({ many, one }) => ({
	sessions: many(sessions),
	oAuthAccounts: many(oAuthAccounts),
	defaultAddress: one(addreses, {
		fields: [users.defaultAddressId],
		references: [addreses.id],
	}),
	requests: many(requests),
	reviews: many(reviews),
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
	ownedById: id('owned_by')
		.references(() => users.id)
		.notNull(),
	availableAt: timestamp('available_at'),
	addressId: id('address_id').notNull(),
	...createdAtUpdatedAt,
})

export const serviceProvidersRelations = relations(serviceProviders, ({ one, many }) => ({
	owner: one(users, {
		fields: [serviceProviders.ownedById],
		references: [users.id],
	}),
	address: one(addreses, {
		fields: [serviceProviders.addressId],
		references: [addreses.id],
	}),
	serviceProvidersToServices: many(serviceProvidersToServices),
}))

export const serviceProvidersToServices = pgTable('service_providers_to_services', {
	serviceProviderId: id('service_provider_id').references(() => serviceProviders.id),
	serviceId: id('service_id').references(() => services.id),
})

export const serviceProvidersToServicesRelations = relations(
	serviceProvidersToServices,
	({ one }) => ({
		serviceProvider: one(serviceProviders, {
			fields: [serviceProvidersToServices.serviceProviderId],
			references: [serviceProviders.id],
		}),
		service: one(services, {
			fields: [serviceProvidersToServices.serviceId],
			references: [services.id],
		}),
	}),
)

export const services = pgTable(
	'services',
	{
		id: primaryId,
		name: varchar('name'),
		price: integer('price'),
		categoryId: id('category_id').references(() => categories.id),
		details: text('details'),
		...createdAtUpdatedAt,
	},
	(table) => ({
		/**
		 * @link https://orm.drizzle.team/learn/guides/postgresql-full-text-search
		 */
		searchIndex: index('search_index').using(
			'gin',
			sql`(
				setweight(to_tsvector('english', ${table.name}), 'A') ||
				setweight(to_tsvector('english', ${table.details}), 'B')
			)`,
		),
	}),
)

export const servicesSearchQuery = `(
	setweight(to_tsvector('english', ${services.name}), 'A') ||
	setweight(to_tsvector('english', ${services.details}), 'B')
)`

export const servicesRelations = relations(services, ({ one, many }) => ({
	serviceProvidersToServices: many(serviceProvidersToServices),
	category: one(categories, {
		fields: [services.categoryId],
		references: [categories.id],
	}),
}))

export const categories = pgTable('categories', {
	id: primaryId,
	name: varchar('name'),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
	services: many(services),
}))

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

export const sessionsRelations = relations(sessions, ({ one }) => ({
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

export const oAuthAccountsRelations = relations(oAuthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oAuthAccounts.userId],
		references: [users.id],
	}),
}))

export const requests = pgTable('requests', {
	id: primaryId,
	requestedById: id('requested_by_id')
		.references(() => users.id)
		.notNull(),
	addressId: id('address_id').references(() => addreses.id),
	serviceProviderId: id('service_provider_id').references(() => serviceProviders.id),
	serviceId: id('service_id')
		.references(() => services.id)
		.notNull(),
	details: text('details'),
	price: integer('price').notNull(),
	meta: jsonb('meta'),
	completedAt: timestamp('completed_at'),
	paidAt: timestamp('paid_at'),
	deletedAt: timestamp('deleted_at'),
	...createdAtUpdatedAt,
})

export const requestsRelations = relations(requests, ({ one, many }) => ({
	requestedBy: one(users, {
		fields: [requests.requestedById],
		references: [users.id],
	}),
	address: one(addreses, {
		fields: [requests.addressId],
		references: [addreses.id],
	}),
	serviceProvider: one(serviceProviders, {
		fields: [requests.serviceProviderId],
		references: [serviceProviders.id],
	}),
	service: one(services, {
		fields: [requests.serviceId],
		references: [services.id],
	}),
	requestImages: many(requestImages),
	reviews: one(reviews),
	tagRatings: many(tagRatings),
}))

export const requestImages = pgTable('request_images', {
	id: primaryId,
	requestId: id('request_id')
		.references(() => requests.id)
		.notNull(),
	fileId: id('file_id')
		.references(() => files.id)
		.notNull(),
})

export const requestImagesRelations = relations(requestImages, ({ one }) => ({
	file: one(files, {
		fields: [requestImages.fileId],
		references: [files.id],
	}),
	request: one(requests, {
		fields: [requestImages.requestId],
		references: [requests.id],
	}),
}))

export const reviews = pgTable('reviews', {
	id: primaryId,
	requestId: id('request_id')
		.references(() => requests.id)
		.notNull(),
	serviceId: id('service_id')
		.references(() => services.id)
		.notNull(),
	rating: smallint('rating').notNull(),
	comment: text('comment'),
	...createdAtUpdatedAt,
})

export const reviewImages = pgTable('review_images', {
	id: primaryId,
	reviewId: id('review_id')
		.references(() => reviews.id)
		.notNull(),
	fileId: id('file_id')
		.references(() => files.id)
		.notNull(),
})

export const reviewImagesRelations = relations(reviewImages, ({ one }) => ({
	file: one(files, {
		fields: [reviewImages.fileId],
		references: [files.id],
	}),
	review: one(reviews, {
		fields: [reviewImages.reviewId],
		references: [reviews.id],
	}),
}))

export const tags = pgTable('tags', {
	id: primaryId,
	name: varchar('name').notNull(),
	serviceId: id('service_id')
		.references(() => services.id)
		.notNull(),
	...createdAtUpdatedAt,
})

export const tagRatings = pgTable('tag_ratings', {
	id: primaryId,
	tagId: id('tag_id')
		.references(() => tags.id)
		.notNull(),
	requestId: id('request_id')
		.references(() => requests.id)
		.notNull(),
	...createdAtUpdatedAt,
})

export const files = pgTable('files', {
	id: primaryId,
	key: varchar('key').notNull(),
	location: varchar('location', {
		enum: ['s3'],
	}).notNull(),
})

export const documents = pgTable('documents', {
	id: primaryId,
	fileId: id('file_id')
		.references(() => files.id)
		.notNull(),
	serviceProviderId: id('service_provider_id')
		.references(() => serviceProviders.id)
		.notNull(),
	type: varchar('type', {
		enum: ['id', 'insurance', 'license'],
	}).notNull(),
	...createdAtUpdatedAt,
})

export const schedules = pgTable('schedules', {
	id: primaryId,
	label: varchar('label'),
	requestId: id('request_id').references(() => requests.id),
	serviceProviderId: id('service_provider_id')
		.references(() => serviceProviders.id)
		.notNull(),
	startedAt: timestamp('start_at').notNull(),
	endedAt: timestamp('end_at').notNull(),
	deletedAt: timestamp('deleted_at'),
	...createdAtUpdatedAt,
})
