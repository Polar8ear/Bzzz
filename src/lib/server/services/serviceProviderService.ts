import { eq } from 'drizzle-orm'
import { db, type DBorTransaction } from '../db'
import { serviceProviders, serviceProvidersToServices } from '../db/schema'

const findServiceProviderByOwnerId = async (ownerId: string) => {
	return await db.query.serviceProviders.findFirst({
		where: eq(serviceProviders.ownedById, ownerId),
	})
}

type ServiceProviderDraft = typeof serviceProviders.$inferInsert

const createServiceProvider = async (
	serviceProvider: ServiceProviderDraft,
	trx: DBorTransaction = db,
) => {
	const [newServiceProvider] = await trx
		.insert(serviceProviders)
		.values(serviceProvider)
		.returning()
	return newServiceProvider
}

const updateAddressId = async (serviceProviderId: string, addressId: string, trx = db) => {
	await trx
		.update(serviceProviders)
		.set({ addressId })
		.where(eq(serviceProviders.id, serviceProviderId))
}

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> }

const getAllServicesIdsByServiceProviderId = async (serviceProviderId: string) => {
	const result = await db.query.serviceProvidersToServices.findMany({
		where: eq(serviceProvidersToServices.serviceProviderId, serviceProviderId),
	})

	return result
		.filter((item): item is NoUndefinedField<typeof item> => item.serviceId != null)
		.map((item) => item.serviceId)
}

export const serviceProviderService = {
	findServiceProviderByOwnerId,
	createServiceProvider,
	updateAddressId,
	getAllServicesIdsByServiceProviderId,
}
