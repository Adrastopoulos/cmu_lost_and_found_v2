// src/pages/_app.tsx
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { AppType } from 'next/app';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { trpc } from '../utils/trpc';

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps }
}) => {
	return (
		<ThemeProvider>
			<SessionProvider session={session}>
				<ToastContainer />
				<Component {...pageProps} />
			</SessionProvider>
		</ThemeProvider>
	);
};

export default trpc.withTRPC(MyApp);
