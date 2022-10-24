/* eslint-disable @typescript-eslint/no-empty-interface */
import { UserEntity } from '../lib/entities';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: UserEntity;
	}

	interface User extends UserEntity {}
}
