// @ts-nocheck
import * as db from '../../lib/db';
import type { PageServerLoad, Actions } from './$types';

export const load = async () => {
    const [locations, asins] = await Promise.all([
        db.getAllLocations(),
        db.getAllAsins()
    ]);

    // Filter out holding area from available locations
    const storage_locations = locations.filter(loc => loc.id !== db.HOLDING_LOCATION_ID);

    return {
        locations: storage_locations,
        asins
    };
};

export const actions = {
    // Decant items between storage locations -CL
    default: async ({ request }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const asin = formData.get('asin') as string;
        const from_location_id = formData.get('from_location_id') as string;
        const to_location_id = formData.get('to_location_id') as string;
        const quantity = Number(formData.get('quantity'));
        const new_condition = formData.get('new_condition') as string;
        const new_status = formData.get('new_status') as string;
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

            // Validate locations exist and are different
            if (from_location_id === to_location_id) {
                return {
                    success: false,
                    error: `Source and destination locations must be different.`
                };
            }

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

            // Perform the decant operation
            await db.decantInventory({
                asin,
                from_location_id,
                to_location_id,
                quantity,
                new_condition: new_condition || undefined,
                new_status: new_status || undefined,
                notes: notes || undefined
            });

            const condition_note = new_condition ? ` (condition changed to ${new_condition})` : '';
            const status_note = new_status ? ` (status changed to ${new_status})` : '';

            return {
                success: true,
                message: `Successfully decanted ${quantity} item(s) with ASIN ${asin} from ${from_location.name} to ${to_location.name}${condition_note}${status_note}`
            };

        } catch (error) {
            console.error('Decant operation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Decant operation failed'
            };
        }
    }
};;null as any as PageServerLoad;;null as any as Actions;