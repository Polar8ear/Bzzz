import { RESEND_API_KEY } from '$env/static/private'
import { Resend } from 'resend'

const resend = new Resend(RESEND_API_KEY)

const sendVerificationEmail = async (verificationCode: string, email: string) => {
	return await resend.emails.send({
		from: 'auth@bzzz.software',
		to: email,
		subject: 'Verify your Bzzz account',
		html: `<p>Congrats on sending your <strong>first email</strong>! Here's your verification code ${verificationCode}</p>`,
	})
}

export { sendVerificationEmail }
