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
	boolean,
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

export const addresses = pgTable('addresses', {
	id: primaryId,
	belongTo: id('belong_to').notNull(),
	belongToType: varchar('belong_to_type', {
		length: 16,
		enum: ['user', 'service_provider'],
	}).notNull(),
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
	country: varchar('country').notNull(),
	coordinate: point('coordinate', {
		mode: 'xy',
	}).notNull(),
	...createdAtUpdatedAt,
})

export const addressesRelation = relations(addresses, ({ one }) => ({
	user: one(users, {
		fields: [addresses.belongTo],
		references: [users.id],
	}),

	serviceProvider: one(serviceProviders, {
		fields: [addresses.belongTo],
		references: [serviceProviders.id],
	}),
}))

export interface DatabaseUserAttributes {
	email: string
	emailVerifiedAt?: Date
	fullName?: string
	isAdmin: boolean
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
	defaultAddressId: id('default_address_id').references((): AnyPgColumn => addresses.id),
	isAdmin: boolean('is_admin').notNull().default(false),
	...createdAtUpdatedAt,
})

export const usersRelations = relations(users, ({ many, one }) => ({
	sessions: many(sessions),
	oAuthAccounts: many(oAuthAccounts),
	defaultAddress: one(addresses, {
		fields: [users.defaultAddressId],
		references: [addresses.id],
	}),
	requests: many(requests),
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
	address: one(addresses, {
		fields: [serviceProviders.addressId],
		references: [addresses.id],
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
		name: varchar('name').notNull(),
		price: integer('price').notNull(),
		categoryId: id('category_id').references(() => categories.id),
		details: text('details').notNull(),
		imageFileId: id('image_file_id').references(() => files.id),
		...createdAtUpdatedAt,
	},
	(table) => ({
		/**
		 * @link https://orm.drizzle.team/learn/guides/postgresql-full-text-search
		 * @description Using Coalce to prevent null values from being indexed
		 */
		searchIndex: index('search_index').using(
			'gin',
			sql`(
				setweight(to_tsvector('english', COALESCE(${table.name}, '')), 'A') ||
				setweight(to_tsvector('english', COALESCE(${table.details}, '')), 'B')
			)`,
		),
	}),
)

export const servicesSearchQuery = (queryString: string) => sql`(
	setweight(to_tsvector('english', COALESCE(${services.name}, '')), 'A') ||
	setweight(to_tsvector('english', COALESCE(${services.details}, '')), 'B')
) @@ websearch_to_tsquery('english', ${queryString})`

export const servicesRelations = relations(services, ({ one, many }) => ({
	serviceProvidersToServices: many(serviceProvidersToServices),
	category: one(categories, {
		fields: [services.categoryId],
		references: [categories.id],
	}),
	image: one(files, {
		fields: [services.imageFileId],
		references: [files.id],
	}),
	reviews: many(reviews),
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
	addressId: id('address_id').references(() => addresses.id),
	serviceProviderId: id('service_provider_id').references(() => serviceProviders.id),
	serviceId: id('service_id')
		.references(() => services.id)
		.notNull(),
	details: text('details'),
	price: integer('price').notNull(),
	unitCount: integer('unit_count').notNull(),
	startedAt: timestamp('start_at').notNull(),
	endedAt: timestamp('end_at').notNull(),
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
	address: one(addresses, {
		fields: [requests.addressId],
		references: [addresses.id],
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

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
	request: one(requests, {
		fields: [reviews.requestId],
		references: [requests.id],
	}),
	service: one(services, {
		fields: [reviews.serviceId],
		references: [services.id],
	}),
	reviewImages: many(reviewImages),
}))

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

export const tagRatingsRelation = relations(tagRatings, ({ one }) => ({
	request: one(requests, {
		fields: [tagRatings.requestId],
		references: [requests.id],
	}),
	tag: one(tags, {
		fields: [tagRatings.tagId],
		references: [tags.id],
	}),
}))

export const files = pgTable('files', {
	id: primaryId,
	key: varchar('key').notNull(),
	location: varchar('location', {
		enum: ['s3', 'uploadthing'],
	}).notNull(),
	uploadedById: id('uploaded_by_id')
		.references(() => users.id)
		.notNull(),
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
