import { Magic } from '@magic-sdk/admin';
import { MAGIC_SECRET_KEY } from '$lib/config';

console.log('***********************', MAGIC_SECRET_KEY)

export const magic = new Magic(MAGIC_SECRET_KEY);
