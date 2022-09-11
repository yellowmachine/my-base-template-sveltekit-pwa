import { createSessionCookie } from './_utils';
import jwt from 'jsonwebtoken';
import { ENCRYPTION_SECRET, SESSION_LENGTH_MS } from '$lib/config';

export async function get(evt) {
	try {
		if (!evt.locals['user']) {
			return {
				status: 200,
				body: {
					user: null
				}
			};
		}

		const metadata = evt.locals['user'];

		// Refresh session
		let token = jwt.sign(
			{	  
			  role: metadata.role,	  
			  exp: Math.floor(Date.now() / 1000) + (SESSION_LENGTH_MS / 1000),
			},
			ENCRYPTION_SECRET,
		  );

		const cookie = await createSessionCookie({metadata, token});

		return {
			status: 200,
			headers: {
				'cache-control': 'no-store',
				'set-cookie': cookie
			},
			body: {
				user: metadata
			}
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: {
				error: {
					message: 'Internal Server Error'
				}
			}
		};
	}
}
