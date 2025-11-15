import { isNotNull } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  type AnyPgColumn,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export type InventoryLocation = typeof locations_table.$inferSelect;
export type ProductType = typeof product_types_table.$inferSelect;
export type Asin = typeof asins_table.$inferSelect;
export type InventoryItem = typeof inventory_items_table.$inferSelect;
export type ItemMove = typeof item_moves_table.$inferSelect;

export const locations_table = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  parent_location_id: uuid("parent_location_id").references(
    (): AnyPgColumn => locations_table.id as any,
    { onDelete: "set null" },
  ),
});

// The product_types table defines the types of products in your inventory system
// Think of this as the "catalog" of items you stock
export const product_types_table = pgTable("product_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  primary_asin: text("primary_asin"), // Will be set after ASIN is created
});

// ASIN stands for Ash Standard Item Number
// An ASIN is a number, encoded on a barcode, that points to a specific type of item.
// An ASIN can be a UPC, EAN, LPN, or really anything
// Multiple ASINs can point to the same product type
export const asins_table = pgTable(
  "asins",
  {
    asin: text("asin").primaryKey(), // Each ASIN code must be unique and is the primary key
    product_type_id: uuid("product_type_id")
      .notNull()
      .references(() => product_types_table.id),
    is_primary: boolean("is_primary").default(false), // Indicates if this is the primary ASIN for the product type
  },
  (table) => [
    // Ensures only one ASIN can be primary per product type
    uniqueIndex("idx_primary_asin_per_product")
      .on(table.product_type_id, table.is_primary)
      .where(sql`${table.is_primary} = true`),
  ],
);

// This is a physical instance of a product (actual inventory item)
export const inventory_items_table = pgTable("inventory_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_type_id: uuid("product_type_id")
    .notNull()
    .references(() => product_types_table.id),
  asin: text("asin")
    .notNull()
    .references(() => asins_table.asin), // The specific ASIN barcode on this item
  condition: text("condition").default("new"), // Could be 'new', 'used', 'damaged', etc.
  status: text("status").default("available"), // 'available', 'reserved', 'shipped', etc.
  location_id: uuid("location_id").references(() => locations_table.id, {
    onDelete: "set null",
  }),
  quantity: integer("quantity").default(1), // For cases where you track quantities rather than individual items
  date_received: text("date_received"), // When the item was received into inventory
});

// These are records of item moves between locations
export const item_moves_table = pgTable("item_moves", {
  id: uuid("id").primaryKey().defaultRandom(),
  move_type: text("move_type").notNull(), // 'pick', 'stow', 'decant', 'condition_change', 'status_change', etc.
  asin: text("asin")
    .notNull()
    .references(() => asins_table.asin),
  quantity: integer("quantity").notNull(),
  initial_location_id: uuid("initial_location_id")
    .notNull()
    .references(() => locations_table.id),
  new_location_id: uuid("new_location_id")
    .notNull()
    .references(() => locations_table.id),
  new_condition: text("new_condition"),
  new_status: text("new_status"),
  timestamp: text("timestamp").notNull(),
  user: text("user"),
  notes: text("notes"),
});

// These are records of item changes, except moves. right now its basically just conditoin changes lol
