import { and, eq } from 'drizzle-orm'
import { db, type DBorTransaction } from '../db'
import { addresses } from '../db/schema'

const findAddressesByUserId = async (userId: string, trx: DBorTransaction = db) => {
	return await trx.query.addresses.findMany({
		where: and(eq(addresses.belongTo, userId), eq(addresses.belongToType, 'user')),
	})
}

const findAddressById = async (addressId: string, trx: DBorTransaction = db) => {
	console.log('addressId', addressId)
	return await trx.query.addresses.findFirst({
		where: (fields, { eq }) => eq(fields.id, addressId),
	})
}

type AddressDraft = typeof addresses.$inferInsert

const createAddress = async (address: AddressDraft, trx: DBorTransaction = db) => {
	const [newAddress] = await trx.insert(addresses).values(address).returning()
	return newAddress
}

const createAddressFromAnotherAddress = async (
	addressId: string,
	overridingDraft: Partial<AddressDraft> = {},
	trx: DBorTransaction = db,
) => {
	const address = await findAddressById(addressId, trx)
	if (address == null) {
		throw new Error('Address not found')
	}

	const newAddressDraft = { ...address, ...overridingDraft, id: undefined }
	return await createAddress(newAddressDraft, trx)
}

export const addressService = {
	findAddressById,
	findAddressesByUserId,
	createAddress,
	createAddressFromAnotherAddress,
}
