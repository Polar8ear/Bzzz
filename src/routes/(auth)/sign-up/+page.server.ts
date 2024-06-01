import { dev } from '$app/environment'
import { github, google } from '$lib/server/auth'
import { redirect, type Actions } from '@sveltejs/kit'
import { generateCodeVerifier, generateState } from 'arctic'

export const actions = {
	google: async (event) => {
		const state = generateState()
		const codeVerifier = generateCodeVerifier()
		const url = await google.createAuthorizationURL(state, codeVerifier, {
			scopes: ['email'],
		})

		event.cookies.set('google_oauth_state', state, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})

		event.cookies.set('google_code_verifier', codeVerifier, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})

		redirect(302, url.toString())
	},
	github: async (event) => {
		const state = generateState()
		const url = await github.createAuthorizationURL(state, {
			scopes: ['user:email'],
		})

		event.cookies.set('github_oauth_state', state, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})

		redirect(302, url.toString())
	},
} satisfies Actions
