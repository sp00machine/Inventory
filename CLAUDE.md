# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TL;DR - Quick Start for New Instances

**What this is:** A personal inventory management system for tracking items around the house with barcodes/labels. Built with SvelteKit 5 + PostgreSQL + Drizzle ORM.

**Core workflow:** Receive items → Pick them (to holding area) → Stow them (to storage) → Explore/search inventory

**Key architectural pattern:** The "Holding Area" is a real database location representing items physically in your hands. It displays persistently across all pages in the layout.

**Most important files:**

- `/src/lib/db.ts` (512 lines) - All database operations
- `/src/routes/+page.svelte` - Main dashboard with search
- `/src/routes/+layout.svelte` - Persistent holding area display
- `/src/db/schema.ts` - Database schema

**Critical gotchas:**

- ⚠️ Never initialize Svelte `$state()` with `data` props (causes 500 errors) - use `$effect()` instead
- ⚠️ Never import `$lib/db` in client components (causes 500 errors) - pass data through `+page.server.ts`
- ⚠️ Always wrap browser APIs (`goto()`, `$page`) in `browser` checks for SSR safety

**Tech stack:** SvelteKit 5, PostgreSQL, Drizzle ORM, Skeleton UI, Bun runtime

---

## Project Overview

This is a personal inventory tracking application for labeling and managing items around the house. The system supports barcode scanning, multiple storage locations, and full movement audit trails.

**Primary use case:** Slapping barcode labels on household items and tracking where everything is located, with support for hierarchical locations (rooms, shelves, boxes), item conditions, and movement history.

**Stack:**

- SvelteKit 5 (with Svelte 5 runes)
- PostgreSQL for data persistence
- Drizzle ORM for type-safe database operations
- Skeleton UI + bits-ui for components
- Docker for containerization
- Bun as the JavaScript runtime

---

## Core Architectural Concepts

### The Holding Area Pattern

The "Holding Area" (`HOLDING_LOCATION_ID = '00000000-0000-0000-0000-133769420647'`) is a **real database location** that represents items physically held by the user. This is elegant because:

- No special-case logic needed in movement functions
- Full audit trail includes "picked to holding" operations
- Displayed persistently in the app layout across all pages
- Automatically created on app startup via `ensureHoldingLocation()`
- Used as default destination for picks, default source for stows

### Smart Merge-on-Insert

`addOrMergeinventoryItem()` automatically merges quantities when adding items that match existing records (same ASIN, location, condition, status). This prevents inventory fragmentation without manual consolidation.

### Quantity Splitting for Partial Moves

`moveInventory()` handles complex scenarios:

- Moving 7 units from a location with two items (10 units + 3 units)
- Reduces first item from 10 → 3
- Deletes second item (fully moved)
- Merges at destination if identical item exists
- Records each operation in audit trail

### Hierarchical Locations

Locations support parent-child relationships (e.g., House → Bedroom → Closet → Shelf 2), enabling organized storage structures.

### Flexible ASIN System

- Multiple barcodes (ASINs) can reference the same product type
- Supports primary/secondary ASIN designation
- ASINs are strings (not integers) to support UPC, EAN, LPN, or custom codes
- One product can have many barcodes, but only one primary

---

## Database Schema

Five main tables in `/src/db/schema.ts`:

| Table                   | Purpose                          | Key Fields                                                                                   |
| ----------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| `locations_table`       | Storage locations with hierarchy | `id`, `name`, `parent_location_id`                                                           |
| `product_types_table`   | Catalog of what can exist        | `id`, `name`, `primary_asin`                                                                 |
| `asins_table`           | Barcodes referencing products    | `asin` (PK), `product_type_id`, `is_primary`                                                 |
| `inventory_items_table` | Physical items in locations      | `id`, `asin`, `location_id`, `quantity`, `condition`, `status`                               |
| `item_moves_table`      | Audit trail of movements         | `id`, `move_type`, `asin`, `initial_location_id`, `new_location_id`, `quantity`, `timestamp` |

**Conditions:** `'new'`, `'used'`, `'damaged'`
**Statuses:** `'available'`, `'reserved'`, `'shipped'`, `'missing'`

---

## Application Structure

### File Organization

```
/src
├── db/schema.ts              # Drizzle schema definitions
├── lib/
│   ├── db.ts                 # All database operations (512 lines)
│   └── components/
│       ├── SuperAutoCombo.svelte      # Search/autocomplete (barcode scanning support)
│       ├── RegisterAsin.svelte        # ASIN registration form
│       └── RegisterLocation.svelte    # Location registration form
└── routes/
    ├── +layout.svelte                 # Persistent holding area display + navigation
    ├── +layout.server.ts              # Load holding area contents
    ├── +page.svelte                   # Dashboard (Inventory + ASINs tabs)
    ├── +page.server.ts                # Load all inventory and product data
    ├── receive/+page.svelte           # Receive items (3-tab interface)
    ├── pick/+page.svelte              # Pick items to holding area
    ├── stow/+page.svelte              # Stow items from holding to storage
    └── decant/+page.svelte            # Move between storage locations
```

### Key Routes

**Dashboard (`/`):**

- **Inventory Tab:** Searchable table of all items (filters by ASIN, product, location, condition, status)
- **ASINs Tab:** Accordion view of product types with statistics and associated barcodes

**Receive (`/receive`):**

- **Tab 1:** Receive items using existing ASIN
- **Tab 2:** Register new ASIN + product type
- **Tab 3:** Register new location

**Pick (`/pick`):** Move items FROM storage TO holding area (or custom destination)

- Auto-selects ASIN if location has only one product
- Auto-selects location if ASIN exists in only one place
- Defaults to holding area destination

**Stow (`/stow`):** Move items FROM holding area TO storage locations

- Shows clickable list of holding area contents
- Auto-selects first item in holding area
- Displays selected item details

**Decant (`/decant`):** Move items BETWEEN storage locations (not involving holding area)

- Optional condition/status changes during move
- Prevents same-location moves
- Useful for reorganization

---

## Critical Coding Guidelines

### ⚠️ SSR Safety with Svelte 5

**NEVER access `data` props during component state initialization** - this causes SSR hydration errors and 500 responses.

❌ **Bad** (causes 500 errors):

```svelte
let selected_value = $state(data.some_property);
```

✅ **Good** (SSR-safe):

```svelte
let selected_value = $state("");

$effect(() => {
    if (data?.some_property && !selected_value) {
        selected_value = data.some_property;
    }
});
```

Use `$derived()` with safe guards for computed values:

```svelte
const options = $derived(() => {
    if (!data?.items) return [];
    return data.items.map(item => ({ value: item.id, label: item.name }));
});
```

### ⚠️ Server-Client Module Separation

**NEVER import server-side modules** (like `$lib/db`) in client-side Svelte components. This causes 500 errors because database connections can't run in the browser.

❌ **Bad**:

```svelte
<script>
import { HOLDING_LOCATION_ID } from "$lib/db";
</script>
```

✅ **Good**:

```typescript
// In +page.server.ts
export const load = async () => {
  return {
    holding_location_id: HOLDING_LOCATION_ID,
  };
};
```

```svelte
<!-- In +page.svelte -->
<script>
let { data } = $props();
const holding_id = data.holding_location_id;
</script>
```

### ⚠️ Browser API Safety

Always wrap browser-specific operations in `browser` checks:

```svelte
<script>
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

if (browser) {
    // Safe to use goto(), $page, localStorage, etc.
}
</script>
```

---

## Development Commands

### Setup

**Note:** Bun is not installed on this NixOS system. All bun commands should be run in `nix-shell`.

Environment variables (`.env`):

```env
DATABASE_URL=postgresql://inventory_user:inventory_password@localhost:5432/inventory
```

### Development

```bash
bun run dev              # Start dev server
bun run dev -- --open    # Start and open browser
bun run build            # Build for production
bun run preview          # Preview production build
bun run check            # Type checking
bun run check:watch      # Watch mode type checking
bun run format           # Format with Prettier
bun run lint             # Lint with Prettier
```

### Database

```bash
bunx drizzle-kit generate  # Generate migrations from schema changes
bunx drizzle-kit migrate   # Run migrations
bunx drizzle-kit push      # Push schema directly (development only)
```

### Docker

```bash
docker compose up           # Start app + database
docker compose up --build   # Rebuild and start
docker compose up -d        # Run in detached mode
docker compose down         # Stop containers
```

---

## Key Database Functions (`/src/lib/db.ts`)

### Inventory Operations

- `getAllInventoryItems()` - Returns all items with joined product/location data
- `addOrMergeinventoryItem()` - Merges identical items instead of creating duplicates
- `getProductTypesWithAsins()` - Returns products with comprehensive inventory statistics

### Movement Operations

- `moveInventory(params)` - Core movement function with partial quantity splitting, auto-merging
- `pickInventory(params)` - Wrapper for moving TO holding area
- `stowInventory(params)` - Wrapper for moving FROM holding area
- `decantInventory(params)` - Wrapper for moving BETWEEN storage locations
- `recordItemMove(move)` - Records movement in audit trail

All move operations:

- Support partial quantities (splits inventory records)
- Merge destination items with identical properties
- Record in `item_moves_table` with type, locations, quantities, timestamps
- Handle condition/status changes (for decant operations)

### Location Operations

- `getAllLocations()` - Get all locations
- `getLocationWithContents(id)` - Location + inventory there
- `getHoldingLocationWithContents()` - Special getter for holding area
- `ensureHoldingLocation()` - Auto-create holding area if missing

### ASIN/Product Operations

- `getAllAsins()`, `getAsinByCode()`, `addAsin()` - ASIN CRUD
- `getAllProductTypes()`, `addProductType()` - Product type management

---

## Components

### SuperAutoCombo (`/src/lib/components/SuperAutoCombo.svelte`)

Advanced searchable dropdown built on bits-ui Combobox. Used throughout the app for ASIN and location selection.

**Features:**

- Accepts `options` array of `{value, label}` objects
- Client-side filtering on both value and label fields
- Supports barcode scanning (direct input)
- Auto-expands dropdown on click (but not on tab navigation)

**Important Implementation Notes:**

- **Infinite Loop Prevention:** Uses `prev_value` pattern + `untrack(options)` to prevent effect loops when syncing `value` → `internal_input_value`. This is critical because bits-ui's internal state management can create feedback loops if you sync state in effects naively.
- The component manages its own internal `internal_input_value` state - parent only controls `value` (the selected ID)
- Effect only runs when `value` actually changes (not on every reactive rerun)
- Options array is read with `untrack()` to prevent reruns when it's recreated

**Usage:**

```svelte
<SuperAutoCombo
    options={location_options}
    bind:value={selected_location}
    placeholder="Optional placeholder text"
/>
```

---

## Coding Style

### Naming Conventions

- **Variables/Functions:** `snake_case` (matches database conventions)
- **Types/Interfaces/Classes:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `HOLDING_LOCATION_ID`)

### Comments

- Add broad overview comments explaining what code sections do
- Sign Claude-generated comments with `-CL` to differentiate from user comments
- Example: `// Auto-select ASIN if only one exists in this location -CL`

### Best Practices

- Use optional chaining (`?.`) and null coalescing (`||`) extensively to prevent crashes
- Check for data existence before calling array methods like `.reduce()` or `.map()`
- Avoid `$derived.by()` for simple store access during SSR - use `$derived()` instead
- Validate form inputs on both client and server side

---

## Known Performance Considerations

These are areas that work fine for personal inventory scale but could be optimized for larger datasets:

1. **N+1 Queries in `getProductTypesWithAsins()`**
   - Currently loops over products, then ASINs, then queries inventory for each
   - Could be optimized to single SQL query with JOINs and GROUP BY

2. **Dashboard Search Performance**
   - Multiple `$derived.by()` calculations rebuild options on every render
   - Consider memoization or caching for large inventories (1000+ items)

3. **No Pagination**
   - Inventory tables load all items at once
   - Fine for household inventory (<1000 items) but would need pagination at scale

4. **Holding Area Recomputation**
   - Layout server loads holding area contents on every page load
   - Could benefit from caching or selective revalidation

---

## Future Enhancement Ideas

Potential features for extending the system:

- **Reporting:** Inventory aging, item turnover, location utilization heatmaps
- **Batch Operations:** Pick lists, bulk stowing
- **Mobile Optimization:** Dedicated mobile layout for barcode scanning workflows
- **Advanced Search:** Date ranges, quantity filters, hierarchical location search
- **Export/Import:** CSV export for backups, bulk import for initial setup
- **User Management:** Multiple users, permission levels (for shared households)

---

## Reference Documentation

Additional documentation files in `/docs`:

- `skeleton-llms.txt` - Skeleton UI library reference
- `svelte-llms-full.txt` - Full Svelte 5 documentation (use when needed)
- `svelte-llms-medium.txt` - Condensed Svelte 5 reference
- `docker-commands.md` - Docker command reference
- `drizzle-constraints.md` - Drizzle ORM constraints guide
- `bits-ui-combobox.html` - Bits UI Combobox docs for Svelte 5

**Note:** If you're more familiar with Svelte 4, make sure to check the Svelte 5 docs - the runes system (`$state`, `$derived`, `$effect`) is very different!
