// src/server/trpc/router/_app.ts
import { router } from '../trpc';
import { authRouter } from './auth';
import { itemRouter } from './item';
import { userRouter } from './user';

export const appRouter = router({
	auth: authRouter,
	item: itemRouter,
	user: userRouter
});

export type AppRouter = typeof appRouter;
