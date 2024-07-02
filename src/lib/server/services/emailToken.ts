import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { emailVerificationTokens, users } from '../db/schema'

// must not exceed length of 16 according to schema
export const NUMBER_OF_CHARACTERS_IN_TOKEN = 8
export const createVerificationToken = (): string => {
	const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz234679'

	const tokenCharacters = new Array<string>(NUMBER_OF_CHARACTERS_IN_TOKEN)
	for (let i = 0; i < NUMBER_OF_CHARACTERS_IN_TOKEN; i++) {
		tokenCharacters[i] = characters[Math.floor(Math.random() * characters.length)]
	}

	return tokenCharacters.join('')
}

export const getEmailToken = async (userId: string, token: string) => {
	return await db.query.emailVerificationTokens.findFirst({
		where: (fields, { eq, and }) => and(eq(fields.userId, userId), eq(fields.id, token)),
	})
}

type Token = NonNullable<Awaited<ReturnType<typeof getEmailToken>>>

export const verifyEmailToken = async (token: Token) => {
	await db
		.delete(emailVerificationTokens)
		.where(
			and(
				eq(emailVerificationTokens.userId, token.userId),
				eq(emailVerificationTokens.id, token.id),
			),
		)
		.execute()
	await db
		.update(users)
		.set({ emailVerifiedAt: new Date() })
		.where(eq(users.id, token.userId))
		.execute()
}
