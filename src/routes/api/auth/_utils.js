import { serialize } from 'cookie';
import { ENCRYPTION_SECRET, SESSION_LENGTH_MS, SESSION_NAME } from '$lib/config';
import Iron from '@hapi/iron';

async function encrypt(data) {
	return data && Iron.seal(data, ENCRYPTION_SECRET, Iron.defaults);
}

async function decrypt(data) {
	return data && Iron.unseal(data, ENCRYPTION_SECRET, Iron.defaults);
}

export async function createSessionCookie(data) {
	const session = await encrypt(data);

	return serialize(SESSION_NAME, session, {
		maxAge: SESSION_LENGTH_MS / 1000, // maxAge is in seconds. Divide by 1000 to convert from milliseconds to seconds.
		expires: new Date(Date.now() + SESSION_LENGTH_MS),
		httpOnly: true,
		secure: process.env['NODE_ENV'] === 'production',
		path: '/',
		sameSite: 'lax'
	});
}

export async function getSession(cookie) {
	return await decrypt(cookie);
}

export function removeSessionCookie() {
	return serialize(SESSION_NAME, '', {
		maxAge: -1,
		path: '/'
	});
}
