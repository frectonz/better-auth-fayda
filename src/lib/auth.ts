import { env } from '$env/dynamic/private';

import { fayda } from 'fayda';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from './server/db';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
	plugins: [
		await fayda({
			clientId: env.CLIENT_ID,
			privateKey: env.PRIVATE_KEY,
			redirectUrl: 'http://localhost:3000/callback'
		})
	],
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['fayda']
		}
	}
});
