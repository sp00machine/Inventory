import * as db from "../../lib/db";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
  const [locations, productTypes, asins] = await Promise.all([
    db.getAllLocations(),
    db.getAllProductTypes(),
    db.getAllAsins(),
  ]);

  return {
    locations,
    productTypes,
    asins,
  };
};

export const actions: Actions = {
  // Process items by ASIN
  default: async ({ request }) => {
    const formData = await request.formData();
    const asin_code = formData.get("asin") as string;
    const quantity = Number(formData.get("quantity"));
    const locationId = formData.get("locationID") as string;
    const condition = (formData.get("condition") as string) || "new";

    // Find the ASIN in the database
    const asin = await db.getAsinByAsin(asin_code);

    if (!asin) {
      return {
        success: false,
        error: `ASIN ${asin_code} not found. Please register this ASIN first.`,
      };
    }

    // Create the inventory item
    const newItem = {
      // id: crypto.randomUUID(),
      product_type_id: asin.product_type_id,
      asin: asin.asin,
      condition,
      status: "available",
      location_id: locationId,
      quantity,
      date_received: new Date().toISOString(),
    };

    await db.addOrMergeinventoryItem(newItem);

    return {
      success: true,
      message: `Successfully received ${quantity} item(s) with ASIN ${asin_code}`,
    };
  },
};
