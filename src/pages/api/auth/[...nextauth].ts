import { TypeORMLegacyAdapter } from '@next-auth/typeorm-legacy-adapter';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { env } from '../../../env/server.mjs';

import GoogleProvider from 'next-auth/providers/google';
import * as entities from '../../../lib/entities';

export const authOptions: NextAuthOptions = {
	callbacks: {
		signIn: async ({ user }) => {
			const isAllowedToSignIn = user.email?.endsWith('andrew.cmu.edu');
			if (isAllowedToSignIn) {
				return true;
			} else {
				return false; // TODO: return custom /unauthorized page
			}
		},
		session: async ({ session, user }) => {
			// Send properties to the client, like an access_token and user id from a provider.
			session.user = JSON.parse(JSON.stringify(user));
			return session;
		}
	},
	secret: env.NEXTAUTH_SECRET,
	adapter: TypeORMLegacyAdapter(
		{ type: 'postgres', url: env.PG_URL },
		{ entities }
	),
	theme: { logo: '/dog-logo.svg' },
	pages: {
		signIn: '/auth/signin'
		// signOut: '/auth/signout',
		// error: '/auth/error', // Error code passed in query string as ?error=
		// verifyRequest: '/auth/verify-request', // (used for check email message)
		// newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	providers: [
		GoogleProvider({
			clientId: env.GCLOUD_CREDENTIALS.installed.client_id,
			clientSecret: env.GCLOUD_CREDENTIALS.installed.client_secret
		})
	]
};

export default NextAuth(authOptions);
