import { query } from "$app/server";
import * as v from 'valibot';
import * as db from "$lib/db";

export const getAvailableItems = query(v.string(), async (location) => {
    return (await db.getLocationWithContents(location)).contents;
});

export const getLocationsWithAsin = query(v.string(), async (asin) => {
    return await db.getLocationsWithAsin(asin);
});
