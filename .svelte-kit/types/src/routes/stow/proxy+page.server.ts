// @ts-nocheck
import * as db from '../../lib/db';
import type { PageServerLoad, Actions } from './$types';

export const load = async () => {
    const [locations, asins, holding_location] = await Promise.all([
        db.getAllLocations(),
        db.getAllAsins(),
        db.getHoldingLocationWithContents()
    ]);

    return {
        locations,
        asins,
        holding_location,
        holding_location_id: db.HOLDING_LOCATION_ID
    };
};

export const actions = {
    // Stow items from holding area to a storage location -CL
    default: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const asin = formData.get('asin') as string;
        const to_location_id = formData.get('to_location_id') as string;
        const quantity = Number(formData.get('quantity'));
        const notes = formData.get('notes') as string;

        try {
            // Validate ASIN exists
            const asin_record = await db.getAsinByAsin(asin);
            if (!asin_record) {
                return {
                    success: false,
                    error: `ASIN ${asin} not found.`
                };
            }

            // Validate destination location exists
            const to_location = await db.getLocationById(to_location_id);
            if (!to_location) {
                return {
                    success: false,
                    error: `Destination location not found.`
                };
            }

            // Perform the stow operation
            await db.stowInventory({
                asin,
                to_location_id,
                quantity,
                notes: notes || undefined
            });

            return {
                success: true,
                message: `Successfully stowed ${quantity} item(s) with ASIN ${asin} to ${to_location.name}`
            };

        } catch (error) {
            console.error('Stow operation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Stow operation failed'
            };
        }
    }
};;null as any as PageServerLoad;;null as any as Actions;