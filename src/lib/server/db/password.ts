import { authLogger } from '$lib/log'
import argon from '@node-rs/argon2'

const argonOptions = {
	// recommended minimum parameters
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
}

export const hash = async (password: string) => {
	authLogger.debug('Hashing password')
	return await argon.hash(password, argonOptions)
}

export const verify = async (hash: string, password: string) => {
	authLogger.debug('Verifying password')
	return await argon.verify(hash, password, argonOptions)
}
