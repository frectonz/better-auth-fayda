import { env } from '$env/dynamic/private';

import { betterFetch } from '@better-fetch/fetch';
import { genericOAuth } from 'better-auth/plugins';
import { betterAuth, type User } from 'better-auth';
import { decodeJwt, importJWK, SignJWT } from 'jose';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from './server/db';

const DISCOVERY_URL = 'https://esignet.ida.fayda.et/.well-known/openid-configuration';
const USER_INFO_URL = 'https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo';
const TOKEN_ENDPOINT = 'https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token';

const REDIRECT_URL = 'http://localhost:3000/callback';

const clientAssertion = await generateSignedJwt();

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'fayda',
					clientId: env.CLIENT_ID,
					clientSecret: '',

					discoveryUrl: DISCOVERY_URL,
					redirectURI: REDIRECT_URL,

					tokenUrlParams: {
						client_assertion: clientAssertion,
						client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
					},

					async getUserInfo(tokens) {
						const userInfo = await betterFetch<Blob>(USER_INFO_URL, {
							method: 'GET',
							headers: {
								Authorization: `Bearer ${tokens.accessToken}`
							},
							retry: 5
						});

						const jwt = await userInfo.data?.text()!;
						const user = decodeJwt(jwt);

						return {
							id: user?.sub,
							emailVerified: user?.email_verified,
							email: user?.email,
							image: user?.picture,
							name: user?.name,
							...userInfo.data
						} as User;
					}
				}
			]
		})
	],
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['fayda']
		}
	}
});

async function generateSignedJwt() {
	const header = {
		alg: 'RS256',
		typ: 'JWT'
	};

	const payload = {
		iss: env.CLIENT_ID,
		sub: env.CLIENT_ID,
		aud: TOKEN_ENDPOINT
	};

	const decodedKey = Buffer.from(env.PRIVATE_KEY, 'base64').toString();
	const jwkObject = JSON.parse(decodedKey);
	const privateKey = await importJWK(jwkObject, 'RS256');

	const jwt = await new SignJWT(payload)
		.setProtectedHeader(header)
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(privateKey);

	return jwt;
}
