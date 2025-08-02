import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (req) => {
	const originalUrl = new URL(req.url, `http://localhost:3000`);
	const target = new URL('http://localhost:3000/api/auth/oauth2/callback/fayda');
	target.search = originalUrl.search;

	redirect(302, target);
};
