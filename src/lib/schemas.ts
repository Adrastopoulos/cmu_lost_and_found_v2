import { z } from 'zod';
import { Building, PermissionLevel } from '../types/constants';

export const UserCreateSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	notifications: z.boolean(),
	permissions: z.array(
		z.object({
			building: z.nativeEnum(Building),
			level: z.nativeEnum(PermissionLevel)
		})
	)
});

export const UserUpdateSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().email().optional(),
	emailVerified: z.string().nullish(),
	image: z.string().nullish(),
	notifications: z.boolean().optional(),
	permissions: z
		.array(
			z.object({
				building: z.nativeEnum(Building),
				level: z.nativeEnum(PermissionLevel)
			})
		)
		.optional()
});

export const UserSchema = UserUpdateSchema.merge(UserCreateSchema);

export const UserListSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(2),
	user: z
		.object({
			email: z.string(),
			name: z.string()
		})
		.optional()
});
