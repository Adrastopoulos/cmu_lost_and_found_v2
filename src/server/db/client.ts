// src/server/db/client.ts
import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { env } from '../../env/server.mjs';
import * as entities from '../../lib/entities';

export const datasource = new DataSource({
	type: 'postgres',
	url: env.PG_URL,
	logging: env.NODE_ENV === 'development' ? ['query'] : ['error'],
	synchronize: env.SYNCHRONIZE_DB,
	entities
});
