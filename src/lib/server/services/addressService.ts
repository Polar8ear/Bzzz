import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { addresses } from '../db/schema'

const findAddressesByUserId = async (userId: string) => {
	return await db.query.addresses.findMany({
		where: and(eq(addresses.belongTo, userId), eq(addresses.belongToType, 'user')),
	})
}

const findAddressById = async (addressId: string) => {
	console.log('addressId', addressId)
	return await db.query.addresses.findFirst({
		where: (fields, { eq }) => eq(fields.id, addressId),
	})
}

type AddressDraft = typeof addresses.$inferInsert

const createAddress = async (address: AddressDraft) => {
	console.log('addressDraft', address)
	const [newAddress] = await db.insert(addresses).values(address).returning()
	return newAddress
}

export const addressService = {
	findAddressById,
	findAddressesByUserId,
	createAddress,
}
