import type { User } from 'lucia'
import { getContext, setContext } from 'svelte'

const USER_CTX = 'USER_CTX' as const

export const setUser = (user: User | null) => {
	setContext(USER_CTX, user)
}

export const getUser = (): User | null => {
	return getContext(USER_CTX)
}
