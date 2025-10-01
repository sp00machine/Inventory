import * as db from '../lib/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		inventoryItems: await db.getAllInventoryItems(),
		asins: await db.getAllAsins(),
		productTypesWithAsins: await db.getProductTypesWithAsins()
	};
};