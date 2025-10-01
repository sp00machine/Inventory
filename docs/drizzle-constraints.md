# Drizzle ORM Constraints Reference

This document provides reference information on implementing constraints in Drizzle ORM, particularly for PostgreSQL.

## Table of Contents
- [Unique Constraints](#unique-constraints)
  - [Single Column](#single-column)
  - [Multiple Columns](#multiple-columns)
  - [Conditional Unique Constraints](#conditional-unique-constraints)
- [Foreign Key Constraints](#foreign-key-constraints)
- [Check Constraints](#check-constraints)
- [Default Values](#default-values)
- [Not Null Constraints](#not-null-constraints)

## Unique Constraints

### Single Column

To make a single column unique:

```typescript
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").unique(), // Simple unique constraint
  username: text("username").unique("custom_constraint_name"), // With custom name
});
```

### Multiple Columns

For composite unique constraints across multiple columns:

```typescript
import { pgTable, uuid, text, unique } from "drizzle-orm/pg-core";

export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id"),
  organizationId: uuid("organization_id"),
}, (table) => [
  // Ensures a user can only be in an organization once
  unique().on(table.userId, table.organizationId),
  // With custom name
  unique("unique_user_org").on(table.userId, table.organizationId)
]);
```

### Conditional Unique Constraints

To create a unique constraint that only applies under certain conditions (partial unique index):

```typescript
import { pgTable, uuid, text, boolean, uniqueIndex, sql } from "drizzle-orm/pg-core";

export const asins = pgTable("asins", {
  id: uuid("id").primaryKey(),
  productTypeId: uuid("product_type_id"),
  isPrimary: boolean("is_primary").default(false),
}, (table) => [
  // Only one ASIN can be primary per product type
  uniqueIndex("idx_primary_asin")
    .on(table.productTypeId, table.isPrimary)
    .where(sql`${table.isPrimary} = true`)
]);
```

For soft-deleted records (only enforce uniqueness on active records):

```typescript
import { pgTable, uuid, text, timestamp, uniqueIndex, sql } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  // Email must be unique among active users
  uniqueIndex("idx_unique_active_email")
    .on(table.email)
    .where(sql`${table.deletedAt} IS NULL`)
]);
```

## Foreign Key Constraints

Basic foreign key:

```typescript
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey(),
  authorId: uuid("author_id").references(() => users.id),
});
```

With deletion/update behavior:

```typescript
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  // Options: "cascade", "restrict", "set null", "set default", "no action"
});
```

## Check Constraints

While Drizzle doesn't have a direct check constraint method, you can use PostgreSQL's check constraints by using the raw SQL capabilities:

```typescript
import { pgTable, integer, serial, customType } from "drizzle-orm/pg-core";

// Example of a custom type with check constraint
const positiveInteger = customType<{ data: number }>({
  dataType() {
    return 'integer check (value > 0)';
  },
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  price: integer("price"),
  // Using the custom type with check constraint
  quantity: positiveInteger("quantity"),
});
```

## Default Values

```typescript
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // Default to random UUID
  createdAt: timestamp("created_at").defaultNow(), // Default to current timestamp
  isActive: boolean("is_active").default(true), // Default to true
  role: text("role").default("user"), // Default to 'user'
});
```

## Not Null Constraints

```typescript
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(), // Cannot be null
  name: text("name").notNull(), // Cannot be null
  bio: text("bio"), // Can be null
});
```

## PostgreSQL-specific Features

### NULLS NOT DISTINCT Option (PostgreSQL 15+)

Allows multiple NULL values to exist in a unique column:

```typescript
import { pgTable, integer, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  externalId: integer("external_id").unique({ nulls: "not distinct" }),
}, (table) => [
  unique().on(table.externalId).nullsNotDistinct()
]);
```

### Case-Insensitive Unique Constraints

For case-insensitive uniqueness (like email addresses):

```typescript
import { pgTable, text, uniqueIndex, sql } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
}, (table) => [
  // Case-insensitive unique email
  uniqueIndex("idx_unique_email_lower").on(sql`lower(${table.email})`)
]);
```