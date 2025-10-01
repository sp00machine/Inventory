// @ts-nocheck
import * as db from '../lib/db';
import type { LayoutServerLoad, Actions } from './$types';

export const load = async ({ params }: Parameters<LayoutServerLoad>[0]) => {
    return {
        holding: await db.getHoldingLocationWithContents()
    };
};