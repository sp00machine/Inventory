// @ts-nocheck
import * as db from '../lib/db';
import type { PageServerLoad, Actions } from './$types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	return {
		inventoryItems: await db.getAllInventoryItems(),
		asins: await db.getAllAsins(),
		productTypesWithAsins: await db.getProductTypesWithAsins()
	};
};