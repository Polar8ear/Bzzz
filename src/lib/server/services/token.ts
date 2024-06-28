import { eq } from 'drizzle-orm'
import { db } from '../db'
import { emailVerificationTokens } from '../db/schema'

// must not exceed length of 16 according to schema
export const createVerificationToken = (): string => {
	const NUMBER_OF_CHARACTERS_IN_TOKEN = 8
	const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz234679'

	const tokenCharacters = new Array<string>(NUMBER_OF_CHARACTERS_IN_TOKEN)
	for (let i = 0; i < NUMBER_OF_CHARACTERS_IN_TOKEN; i++) {
		tokenCharacters[i] = characters[Math.floor(Math.random() * characters.length)]
	}

	return tokenCharacters.join('')
}

export const verifyEmailToken = async (userId: string, token: string) => {
	const verificationToken = await db.query.emailVerificationTokens.findFirst({
		where: (fields, { eq, and }) => and(eq(fields.userId, userId), eq(fields.id, token)),
	})

	if (verificationToken != null) {
		await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, token)).execute()
	}
}
