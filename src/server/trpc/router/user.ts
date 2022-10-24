import { TRPCError } from '@trpc/server';
import { ILike } from 'typeorm';
import { z } from 'zod';
import { UserEntity } from '../../../lib/entities';
import {
	UserCreateSchema,
	UserListSchema,
	UserUpdateSchema
} from '../../../lib/schemas';
import { datasource } from '../../db/client';
import { publicProcedure, router } from '../trpc';

export const userRouter = router({
	count: publicProcedure.query(() =>
		datasource.getRepository(UserEntity).count()
	),
	list: publicProcedure.input(UserListSchema).query(({ input }) =>
		datasource.getRepository(UserEntity).find({
			take: input.limit,
			skip: (input.page - 1) * input.limit,
			order: { email: 'ASC' },
			where: [
				{ name: ILike(`%${input.user?.name}%` ?? '%%') },
				{ email: ILike(`%${input.user?.email}%` ?? '%%') }
			]
		})
	),
	byId: publicProcedure
		.input(z.string())
		.query(({ input }) =>
			datasource.getRepository(UserEntity).findBy({ id: input })
		),
	update: publicProcedure
		.input(UserUpdateSchema)
		.mutation(async ({ input }) => {
			const userRepository = datasource.getRepository(UserEntity);
			const user = await userRepository.findOneBy({ id: input.id });
			if (!user)
				return new TRPCError({
					code: 'NOT_FOUND',
					message: `A user with id ${input.id} does not exist`
				});
			userRepository.merge(user, input);
			await userRepository.save(user);
			return user;
		}),
	create: publicProcedure
		.input(UserCreateSchema)
		.mutation(async ({ input }) =>
			datasource.getRepository(UserEntity).save(input)
		)
});
