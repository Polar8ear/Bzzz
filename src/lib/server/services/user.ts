import { eq } from 'drizzle-orm'
import { db } from '../db'
import { emailVerificationTokens } from '../db/schema'

export const verifyEmail = (userId: string, token: string) => {
	const verificationToken = db.query.emailVerificationTokens.findFirst({
		where: (fields, { eq, and }) => and(eq(fields.userId, userId), eq(fields.id, token)),
	})

	if (verificationToken != null) {
		db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, token)).execute()
	}
}
