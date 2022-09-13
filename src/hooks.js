import cookie from 'cookie';
//import type { Handle } from '@sveltejs/kit';
import { SESSION_NAME } from '$lib/config';
import { getSession } from './routes/api/auth/_utils';
//import type { Locals } from '$lib/types';

export const handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	const user = await getSession(cookies[SESSION_NAME]);

	console.log(user)
	if(user){
		event.locals['user'] = user.metadata;
		event.locals['token'] = user.token;
	}

	// TODO https://github.com/sveltejs/kit/issues/1046
	// if (request.query.has('_method')) {
	// 	request.method = request.query.get('_method').toUpperCase();
	// }

	const response = await resolve(event);

	return response;
};
