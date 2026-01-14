import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, desc } from "drizzle-orm";
import {
  inventory_items_table,
  locations_table,
  product_types_table,
  asins_table,
  item_moves_table,
} from "../db/schema";
import * as pg from "pg";
import type { PgUUID } from "drizzle-orm/pg-core";

export const HOLDING_LOCATION_ID = "00000000-0000-0000-0000-133769420647";

// Create a connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Create drizzle instance
const db = drizzle(pool);

// Ensure the special holding location exists
// This is a virtual location that represents items not yet placed on shelves
export async function ensureHoldingLocation() {
  const existing = await getLocationById(HOLDING_LOCATION_ID);
  if (!existing) {
    await addLocation({
      id: HOLDING_LOCATION_ID,
      name: "**Holding Area**",
      description: "Temporary holding area for unplaced inventory",
      parent_location_id: null,
    });
  }
}

await ensureHoldingLocation();

// =============== Inventory Items ===============

// Get all inventory items with related information
export async function getAllInventoryItems() {
  const items = await db
    .select({
      id: inventory_items_table.id,
      product_type_id: inventory_items_table.product_type_id,
      asin: inventory_items_table.asin,
      condition: inventory_items_table.condition,
      status: inventory_items_table.status,
      location_id: inventory_items_table.location_id,
      quantity: inventory_items_table.quantity,
      date_received: inventory_items_table.date_received,
      // Join with product_types
      product_name: product_types_table.name,
      product_description: product_types_table.description,
      product_type_is_removed: product_types_table.is_removed,
      // Join with asins
      asin_code: asins_table.asin,
      asin_is_removed: asins_table.is_removed,
      // Join with locations
      location_name: locations_table.name,
      location_is_removed: locations_table.is_removed,
    })
    .from(inventory_items_table)
    .leftJoin(
      product_types_table,
      eq(inventory_items_table.product_type_id, product_types_table.id),
    )
    .leftJoin(asins_table, eq(inventory_items_table.asin, asins_table.asin))
    .leftJoin(
      locations_table,
      eq(inventory_items_table.location_id, locations_table.id),
    );

  return items;
}

// Adds a new inventory item, or merges it with an existing one if the same
export async function addOrMergeinventoryItem(
  newItem: typeof inventory_items_table.$inferInsert,
) {
  // try to find an existing item with the same product_type_id, asin, condition, status, and location_id
  const existingItem = await db
    .select()
    .from(inventory_items_table)
    .where(
      and(
        eq(inventory_items_table.asin, newItem.asin as string),
        eq(inventory_items_table.location_id, newItem.location_id as string),
        eq(inventory_items_table.condition, newItem.condition as string),
        eq(inventory_items_table.status, newItem.status as string),
      ),
    )
    .limit(1);

  if (existingItem.length > 0) {
    // If found, update the quantity
    const updatedQuantity =
      (existingItem[0].quantity || 0) + (newItem.quantity || 0);
    await db
      .update(inventory_items_table)
      .set({ quantity: updatedQuantity })
      .where(eq(inventory_items_table.id, existingItem[0].id));
    return { ...existingItem[0], quantity: updatedQuantity };
  } else {
    // If not found, insert the new item
    const result = await db
      .insert(inventory_items_table)
      .values(newItem)
      .returning();
    return result[0];
  }
}
// =============== Product Types ===============
// A product type can have multiple ASINs, but only one primary ASIN

// Get all product types
export async function getAllProductTypes() {
  return await db
    .select({
      id: product_types_table.id,
      name: product_types_table.name,
      description: product_types_table.description,
      primary_asin: product_types_table.primary_asin,
      is_removed: product_types_table.is_removed,
    })
    .from(product_types_table);
}

// Get a product type by ID
export async function getProductTypeById(id: string) {
  return await db
    .select({
      id: product_types_table.id,
      name: product_types_table.name,
      description: product_types_table.description,
      primary_asin: product_types_table.primary_asin,
      is_removed: product_types_table.is_removed,
    })
    .from(product_types_table)
    .where(eq(product_types_table.id, id));
}

// Add a new product type
export async function addProductType(
  productType: typeof product_types_table.$inferInsert,
) {
  console.log("Inserting product type:", productType);
  const result = await db
    .insert(product_types_table)
    .values(productType)
    .returning();
  console.log("Database returned:", result);
  console.log("First result item:", result[0]);
  return result[0];
}

// Update an existing product type
export async function updateProductType(
  id: string,
  updates: Partial<typeof product_types_table.$inferInsert>,
) {
  await db
    .update(product_types_table)
    .set(updates)
    .where(eq(product_types_table.id, id));
}

// =============== ASINs ===============

// Get all ASINs, joined with product type info
export async function getAllAsins() {
  return await db
    .select({
      asin: asins_table.asin,
      product_type_id: asins_table.product_type_id,
      is_primary: asins_table.is_primary,
      is_removed: asins_table.is_removed,
      // Join with product_types
      product_name: product_types_table.name,
      product_description: product_types_table.description,
    })
    .from(asins_table)
    .leftJoin(
      product_types_table,
      eq(asins_table.product_type_id, product_types_table.id),
    );
}

// Get product types grouped with their associated ASINs and inventory statistics -CL
export async function getProductTypesWithAsins() {
  const product_types = await db
    .select({
      id: product_types_table.id,
      name: product_types_table.name,
      description: product_types_table.description,
      primary_asin: product_types_table.primary_asin,
      is_removed: product_types_table.is_removed,
    })
    .from(product_types_table);

  const result = [];
  for (const product_type of product_types) {
    // Get ASINs for this product type
    const asins = await db
      .select({
        asin: asins_table.asin,
        product_type_id: asins_table.product_type_id,
        is_primary: asins_table.is_primary,
        is_removed: asins_table.is_removed,
      })
      .from(asins_table)
      .where(eq(asins_table.product_type_id, product_type.id));

    // Get inventory statistics for the product type
    const inventory_stats = await db
      .select({
        total_quantity: inventory_items_table.quantity,
        condition: inventory_items_table.condition,
        status: inventory_items_table.status,
        location_name: locations_table.name,
        date_received: inventory_items_table.date_received,
      })
      .from(inventory_items_table)
      .leftJoin(
        locations_table,
        eq(inventory_items_table.location_id, locations_table.id),
      )
      .where(eq(inventory_items_table.product_type_id, product_type.id));

    // Calculate summary statistics for the product type
    const total_quantity = inventory_stats.reduce(
      (sum, item) => sum + (item.total_quantity || 0),
      0,
    );
    const unique_locations = [
      ...new Set(
        inventory_stats.map((item) => item.location_name).filter(Boolean),
      ),
    ];
    const last_received = inventory_stats
      .map((item) => item.date_received)
      .filter(Boolean)
      .sort()
      .pop();

    // Get statistics for each ASIN
    const asins_with_stats = [];
    for (const asin of asins) {
      const asin_inventory = await db
        .select({
          quantity: inventory_items_table.quantity,
          condition: inventory_items_table.condition,
          status: inventory_items_table.status,
          location_name: locations_table.name,
          date_received: inventory_items_table.date_received,
        })
        .from(inventory_items_table)
        .leftJoin(
          locations_table,
          eq(inventory_items_table.location_id, locations_table.id),
        )
        .where(eq(inventory_items_table.asin, asin.asin));

      const asin_total_quantity = asin_inventory.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
      const asin_locations = [
        ...new Set(
          asin_inventory.map((item) => item.location_name).filter(Boolean),
        ),
      ];
      const asin_last_received = asin_inventory
        .map((item) => item.date_received)
        .filter(Boolean)
        .sort()
        .pop();

      asins_with_stats.push({
        ...asin,
        stats: {
          total_quantity: asin_total_quantity || 0,
          locations: asin_locations || [],
          last_received: asin_last_received || null,
          condition_breakdown: asin_inventory.reduce(
            (acc, item) => {
              const condition = item.condition || "unknown";
              acc[condition] = (acc[condition] || 0) + (item.quantity || 0);
              return acc;
            },
            {} as Record<string, number>,
          ),
          status_breakdown: asin_inventory.reduce(
            (acc, item) => {
              const status = item.status || "unknown";
              acc[status] = (acc[status] || 0) + (item.quantity || 0);
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
      });
    }

    result.push({
      ...product_type,
      asins: asins_with_stats,
      stats: {
        total_quantity: total_quantity || 0,
        unique_locations: unique_locations || [],
        last_received: last_received || null,
        condition_breakdown: inventory_stats.reduce(
          (acc, item) => {
            const condition = item.condition || "unknown";
            acc[condition] = (acc[condition] || 0) + (item.total_quantity || 0);
            return acc;
          },
          {} as Record<string, number>,
        ),
        status_breakdown: inventory_stats.reduce(
          (acc, item) => {
            const status = item.status || "unknown";
            acc[status] = (acc[status] || 0) + (item.total_quantity || 0);
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
    });
  }

  return result;
}

// Get ASINs for a specific product type
export async function getAsinsByProductType(product_type_id: string) {
  return await db
    .select({
      asin: asins_table.asin,
      product_type_id: asins_table.product_type_id,
      is_primary: asins_table.is_primary,
      is_removed: asins_table.is_removed,
    })
    .from(asins_table)
    .where(eq(asins_table.product_type_id, product_type_id));
}

// Get an ASIN by its code
export async function getAsinByCode(asinCode: string) {
  const results = await db
    .select({
      asin: asins_table.asin,
      product_type_id: asins_table.product_type_id,
      is_primary: asins_table.is_primary,
      is_removed: asins_table.is_removed,
    })
    .from(asins_table)
    .where(eq(asins_table.asin, asinCode));
  return results[0] || null;
}

// Get an ASIN by its code (now the primary key)
export async function getAsinByAsin(asin: string) {
  const results = await db
    .select({
      asin: asins_table.asin,
      product_type_id: asins_table.product_type_id,
      is_primary: asins_table.is_primary,
      is_removed: asins_table.is_removed,
    })
    .from(asins_table)
    .where(eq(asins_table.asin, asin));
  return results[0] || null;
}
// Add a new ASIN
export async function addAsin(asin: typeof asins_table.$inferInsert) {
  // If this ASIN is being set as primary, we need to make sure any other ASINs
  // for this product type are not set as primary
  if (asin.is_primary) {
    await db
      .update(asins_table)
      .set({ is_primary: false })
      .where(eq(asins_table.product_type_id, asin.product_type_id));
  }

  // Insert the ASIN and get the result with the generated ID
  const result = await db.insert(asins_table).values(asin).returning();
  const insertedAsin = result[0];

  // If this is primary, update the product_type to reference this ASIN
  if (asin.is_primary && insertedAsin) {
    await updateProductType(asin.product_type_id, {
      primary_asin: insertedAsin.asin,
    });
  }

  return insertedAsin;
}

// =============== Locations ===============

// Get all locations
export async function getAllLocations() {
  return await db
    .select({
      id: locations_table.id,
      name: locations_table.name,
      description: locations_table.description,
      parent_location_id: locations_table.parent_location_id,
      can_contain_items: locations_table.can_contain_items,
      is_removed: locations_table.is_removed,
    })
    .from(locations_table);
}

// Add a new location
export async function addLocation(
  location: typeof locations_table.$inferInsert,
) {
  await db.insert(locations_table).values(location);
  return location;
}

// Get a location by name
export async function getLocationByName(locationName: string) {
  return await db
    .select({
      id: locations_table.id,
      name: locations_table.name,
      description: locations_table.description,
      parent_location_id: locations_table.parent_location_id,
      can_contain_items: locations_table.can_contain_items,
      is_removed: locations_table.is_removed,
    })
    .from(locations_table)
    .where(eq(locations_table.name, locationName))
    .then((results) => results[0] || null);
}

// Get a location by ID
export async function getLocationById(locationId: string) {
  return await db
    .select({
      id: locations_table.id,
      name: locations_table.name,
      description: locations_table.description,
      parent_location_id: locations_table.parent_location_id,
      can_contain_items: locations_table.can_contain_items,
      is_removed: locations_table.is_removed,
    })
    .from(locations_table)
    .where(eq(locations_table.id, locationId))
    .then((results) => results[0] || null);
}

// Get a location and its contents, i.e. all inventory items stored there
export async function getLocationWithContents(locationId: string) {
  if (!locationId) {
    throw new Error("Location ID is required");
  }

  const location_promise = getLocationById(locationId);

  const contents_promise = await db
    .select({
      id: inventory_items_table.id,
      product_type_id: inventory_items_table.product_type_id,
      asin: inventory_items_table.asin,
      condition: inventory_items_table.condition,
      status: inventory_items_table.status,
      location_id: inventory_items_table.location_id,
      quantity: inventory_items_table.quantity,
      date_received: inventory_items_table.date_received,
      // Join with product_types
      product_name: product_types_table.name,
      product_description: product_types_table.description,
      product_type_is_removed: product_types_table.is_removed,
      // Join with asins
      asin_code: asins_table.asin,
      asin_is_removed: asins_table.is_removed,
      // Join with locations
      location_name: locations_table.name,
      location_is_removed: locations_table.is_removed,
    })
    .from(inventory_items_table)
    .leftJoin(
      product_types_table,
      eq(inventory_items_table.product_type_id, product_types_table.id),
    )
    .leftJoin(asins_table, eq(inventory_items_table.asin, asins_table.asin))
    .leftJoin(
      locations_table,
      eq(inventory_items_table.location_id, locations_table.id),
    )
    .where(eq(inventory_items_table.location_id, locationId));

  const [location, contents] = await Promise.all([
    location_promise,
    contents_promise,
  ]);

  // Return the location, with contents tacked on as an array
  return {
    ...location,
    contents: contents || [],
  };
}

// Get all locations that contain a specific ASIN with inventory quantity -CL
export async function getLocationsWithAsin(asin: string) {
  if (!asin) {
    throw new Error("ASIN is required");
  }

  const locations = await db
    .select({
      location_id: inventory_items_table.location_id,
      location_name: locations_table.name,
      location_is_removed: locations_table.is_removed,
      quantity: inventory_items_table.quantity,
    })
    .from(inventory_items_table)
    .leftJoin(
      locations_table,
      eq(inventory_items_table.location_id, locations_table.id),
    )
    .where(eq(inventory_items_table.asin, asin));

  return locations;
}

// Get the special holding location
export function getHoldingLocation() {
  return getLocationById(HOLDING_LOCATION_ID);
}

// Get the holding location with its contents
export function getHoldingLocationWithContents() {
  return getLocationWithContents(HOLDING_LOCATION_ID);
}

// =============== Item Moves ===============

// Record a move in the item_moves_table -CL
export async function recordItemMove(
  move: typeof item_moves_table.$inferInsert,
) {
  const result = await db.insert(item_moves_table).values(move).returning();
  return result[0];
}

// Get all moves for a specific ASIN -CL
export async function getMovesByAsin(asin: string) {
  return await db
    .select()
    .from(item_moves_table)
    .where(eq(item_moves_table.asin, asin))
    .orderBy(desc(item_moves_table.timestamp));
}

// =============== Inventory Operations ===============

// Move inventory between locations, handling partial quantities by splitting records -CL
export async function moveInventory(params: {
  asin: string;
  from_location_id: string;
  to_location_id: string;
  quantity: number;
  move_type: "pick" | "stow" | "decant";
  new_condition?: string;
  new_status?: string;
  user?: string;
  notes?: string;
}) {
  const {
    asin,
    from_location_id,
    to_location_id,
    quantity,
    move_type,
    new_condition,
    new_status,
    user,
    notes,
  } = params;

  // Find existing inventory items at the source location with this ASIN
  const source_items = await db
    .select()
    .from(inventory_items_table)
    .where(
      and(
        eq(inventory_items_table.asin, asin),
        eq(inventory_items_table.location_id, from_location_id),
      ),
    );

  if (source_items.length === 0) {
    throw new Error(`No inventory found for ASIN ${asin} at source location`);
  }

  // Calculate total available quantity
  const total_available = source_items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  if (total_available < quantity) {
    throw new Error(
      `Insufficient quantity. Available: ${total_available}, Requested: ${quantity}`,
    );
  }

  let remaining_to_move = quantity;
  const moved_items = [];

  // Process each source item until we've moved the requested quantity
  for (const source_item of source_items) {
    if (remaining_to_move <= 0) break;

    const item_quantity = source_item.quantity || 0;
    const quantity_to_take = Math.min(remaining_to_move, item_quantity);

    if (quantity_to_take === item_quantity) {
      // Moving entire item - delete source and add/merge at destination
      await db
        .delete(inventory_items_table)
        .where(eq(inventory_items_table.id, source_item.id));

      const new_item = {
        product_type_id: source_item.product_type_id,
        asin: source_item.asin,
        condition: new_condition || source_item.condition,
        status: new_status || source_item.status,
        location_id: to_location_id,
        quantity: quantity_to_take,
        date_received: source_item.date_received,
      };

      const merged_item = await addOrMergeinventoryItem(new_item);

      moved_items.push({
        ...merged_item,
        quantity: quantity_to_take,
      });
    } else {
      // Partial move - split the item
      // Reduce quantity of source item
      await db
        .update(inventory_items_table)
        .set({ quantity: item_quantity - quantity_to_take })
        .where(eq(inventory_items_table.id, source_item.id));

      // Create new item at destination with the moved quantity
      const new_item = {
        product_type_id: source_item.product_type_id,
        asin: source_item.asin,
        condition: new_condition || source_item.condition,
        status: new_status || source_item.status,
        location_id: to_location_id,
        quantity: quantity_to_take,
        date_received: source_item.date_received,
      };

      // Use addOrMergeinventoryItem to handle merging with existing items at destination
      const merged_item = await addOrMergeinventoryItem(new_item);

      moved_items.push({
        ...merged_item,
        quantity: quantity_to_take,
      });
    }

    remaining_to_move -= quantity_to_take;
  }

  // Record the move
  await recordItemMove({
    move_type,
    asin,
    quantity,
    initial_location_id: from_location_id,
    new_location_id: to_location_id,
    new_condition,
    new_status,
    timestamp: new Date().toISOString(),
    user,
    notes,
  });

  return moved_items;
}

// Pick operation: move items from a location to holding area -CL
export async function pickInventory(params: {
  asin: string;
  from_location_id: string;
  quantity: number;
  user?: string;
  notes?: string;
}) {
  return await moveInventory({
    ...params,
    to_location_id: HOLDING_LOCATION_ID,
    move_type: "pick",
  });
}

// Stow operation: move items from holding area to a location -CL
export async function stowInventory(params: {
  asin: string;
  to_location_id: string;
  quantity: number;
  user?: string;
  notes?: string;
}) {
  return await moveInventory({
    ...params,
    from_location_id: HOLDING_LOCATION_ID,
    move_type: "stow",
  });
}

// Decant operation: move items between two locations -CL
export async function decantInventory(params: {
  asin: string;
  from_location_id: string;
  to_location_id: string;
  quantity: number;
  new_condition?: string;
  new_status?: string;
  user?: string;
  notes?: string;
}) {
  return await moveInventory({
    ...params,
    move_type: "decant",
  });
}