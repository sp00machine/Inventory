import * as db from '../../../lib/db';
import type { Actions } from './$types';

export const actions: Actions = {
    // Register a new location
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string || '';
        const parentLocationId = formData.get('parent') as string || null;

        // Create the location
        // const locationId = crypto.randomUUID();
        await db.addLocation({
            // id: locationId,
            name,
            description,
            parent_location_id: parentLocationId
        });

        return {
            success: true,
            message: `Successfully registered new location ${name}`
        };
    }
};
