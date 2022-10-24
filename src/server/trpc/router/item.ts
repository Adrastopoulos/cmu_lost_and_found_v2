import { ItemEntity } from '../../../lib/entities';
import { datasource } from '../../db/client';
import { publicProcedure, router } from '../trpc';

export const itemRouter = router({
	getAll: publicProcedure.query(async () =>
		datasource.getRepository(ItemEntity).find()
	)
});
