// @ts-nocheck
import * as db from '../../lib/db';
import type { PageServerLoad, Actions } from './$types';

export const load = async () => {
    const [locations, asins, holding_location, inventory_items] = await Promise.all([
        db.getAllLocations(),
        db.getAllAsins(),
        db.getHoldingLocationWithContents(),
        db.getAllInventoryItems()
    ]);

    return {
        locations,
        asins,
        holding_location,
        holding_location_id: db.HOLDING_LOCATION_ID,
        inventory_items
    };
};

export const actions = {
    // Pick items from a location to holding area -CL
    default: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const asin = formData.get('asin') as string;
        const from_location_id = formData.get('from_location_id') as string;
        const to_location_id = formData.get('to_location_id') as string || db.HOLDING_LOCATION_ID;
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

            // Validate locations exist
            const [from_location, to_location] = await Promise.all([
                db.getLocationById(from_location_id),
                db.getLocationById(to_location_id)
            ]);

            if (!from_location) {
                return {
                    success: false,
                    error: `Source location not found.`
                };
            }

            if (!to_location) {
                return {
                    success: false,
                    error: `Destination location not found.`
                };
            }

            // Perform the pick operation
            if (to_location_id === db.HOLDING_LOCATION_ID) {
                await db.pickInventory({
                    asin,
                    from_location_id,
                    quantity,
                    notes: notes || undefined
                });
            } else {
                // If not going to holding area, use general move operation
                await db.moveInventory({
                    asin,
                    from_location_id,
                    to_location_id,
                    quantity,
                    move_type: 'pick',
                    notes: notes || undefined
                });
            }

            const destination_name = to_location_id === db.HOLDING_LOCATION_ID ? 'Holding Area' : to_location.name;

            return {
                success: true,
                message: `Successfully picked ${quantity} item(s) with ASIN ${asin} from ${from_location.name} to ${destination_name}`
            };

        } catch (error) {
            console.error('Pick operation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Pick operation failed'
            };
        }
    }
};;null as any as PageServerLoad;;null as any as Actions;