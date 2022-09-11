import { magic } from './_magic';
import { createSessionCookie } from './_utils';
import jwt from 'jsonwebtoken';
import { ENCRYPTION_SECRET, SESSION_LENGTH_MS } from '$lib/config';

export async function post(evt) {
	try {
		const didToken = magic.utils.parseAuthorizationHeader(evt.request.headers.get('authorization'));
		await magic.token.validate(didToken);
		const _metadata = await magic.users.getMetadataByToken(didToken);

		let role = 'ADMIN';
		const metadata = {..._metadata, role}
		
		let token = jwt.sign(
			{	  
			  role,	  
			  exp: Math.floor(Date.now() / 1000) + (SESSION_LENGTH_MS / 1000),
			},
			ENCRYPTION_SECRET,
		  );

		const cookie = await createSessionCookie({metadata, token});

		return {
			status: 200,
			headers: {
				'set-cookie': cookie
			},
			//@ts-ignore
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
