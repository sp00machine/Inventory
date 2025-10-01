import * as db from '../../../lib/db';
import type { Actions } from './$types';

export const actions: Actions = {
    // Register a new ASIN and product
    default: async ({ request }) => {
        const form_data = await request.formData();
        const asin_code = form_data.get('asin') as string;
        const product_name = form_data.get('product_name') as string;
        const description = form_data.get('description') as string || '';
        const is_primary = form_data.get('is_primary') === "on";

        console.log('hoooo boy lets do this');
        console.log(form_data);

        // Check if the ASIN already exists
        const existing_asin = await db.getAsinByCode(asin_code);
        if (existing_asin) {
            return {
                success: false,
                error: `ASIN ${asin_code} already exists in the system.`
            };
        }

        // Create a new product type
        const product = await db.addProductType({
            // id: productTypeId,
            name: product_name,
            description,
            primary_asin: is_primary ? asin_code : null
        });

        console.log("just added a new product!");
        console.log(product);

        // If that didn't work, just give up
        if (!product) {
            console.error("Failed to create product type");
            return {
                success: false,
                error: `Failed to create product type for ${product_name}.`
            };
        }

        // Create the ASIN
        const inserted_asin = await db.addAsin({
            asin: asin_code,
            product_type_id: product.id,
            is_primary: is_primary
        });
        console.log("just inserted a new asin record!");
        console.log(inserted_asin);

        // Note: If isPrimary is true, the addAsin function now handles updating 
        // the product type's primary_asin_id automatically

        return {
            success: true,
            message: `Successfully registered new ASIN ${asin_code} for product ${product_name}`
        };
    }
};
