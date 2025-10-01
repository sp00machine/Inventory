# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Inventory Management application built with:

- SvelteKit (v5) for the frontend
- PostgreSQL for the database
- Drizzle ORM for database interactions
- Docker for containerization
- Bun as the JavaScript runtime

The app allows users to track inventory items across different locations, with features for adding, viewing, and managing inventory items.

## Commands

### Development

Please note, bun is not currently installed on this NixOS system.
All bun commands should be run in a nix-shell

```bash
# Start the development server
bun run dev

# Start with auto-open in browser
bun run dev -- --open

# Build the application for production
bun run build

# Preview the production build
bun run preview

# Type checking
bun run check

# Watch mode type checking
bun run check:watch

# Format code with Prettier
bun run format

# Lint code with Prettier
bun run lint
```

### Database

```bash
# Generate migrations
bunx drizzle-kit generate

# Run migrations
bunx drizzle-kit migrate

# Push schema changes directly to the database (for development)
bunx drizzle-kit push
```

### Docker

```bash
# Start the application and database with Docker Compose
docker compose up

# Rebuild and start containers
docker compose up --build

# Run in detached mode
docker compose up -d

# Stop containers
docker compose down
```

## Architecture

### Database Schema

The database has five main tables:

- `locations_table`: Stores location information with hierarchical structure (parent-child relationships)
- `product_types_table`: Defines product types/catalog items (e.g., "iPhone 14", "Widget A")
- `asins_table`: Stores ASIN codes (barcodes) that reference product types, with support for primary/secondary ASINs
- `inventory_items_table`: Stores physical inventory items with quantity, condition, status, and location references
- `item_moves_table`: Tracks all inventory movements with move type, locations, quantities, and timestamps for full audit trail

### Application Structure

- `/src/db/schema.ts`: Contains the database schema definitions using Drizzle ORM
- `/src/lib/db.ts`: Database utility functions for querying and modifying data
- `/src/routes/`: SvelteKit routes:
  - `+page.svelte`: Main inventory dashboard with two tabs:
    - **Inventory Tab**: Searchable table of all inventory items with filtering
    - **ASINs Tab**: Expandable accordion view of product types with associated ASINs and inventory statistics
  - `+page.server.ts`: Server-side load and form actions
  - `/receive/+page.svelte`: Specialized form for receiving inventory using Skeleton tabs
  - `/stow/+page.svelte`: Form for stowing inventory
  - `/pick/+page.svelte`: Form for picking inventory
  - `/decant/+page.svelte`: Form for decanting inventory

### UI Components

The application uses:

- **Skeleton UI library** for SvelteKit:
  - Navigation Bar for app-wide navigation
  - Tabs component for multi-view forms
  - Accordion component for expandable product type views
  - Alert components for notifications
- **Custom components** in `/src/lib/components/`:
  - `SuperAutoCombo.svelte`: Advanced search/autocomplete component built on bits-ui Combobox
    - Note: Setting initial values on this component can be tricky due to bits-ui's internal state management
    - The `inputValue` prop may not accept all callback patterns - check bits-ui docs when debugging

### Data Flow

1. Database schema is defined in `src/db/schema.ts`
2. Database connections and queries are handled in `src/lib/db.ts`
3. Server-side data loading happens in `+page.server.ts` files
4. Form submissions are processed through SvelteKit actions
5. UI components render data and provide forms in `+page.svelte` files

## Environment Setup

The application requires a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://inventory_user:inventory_password@localhost:5432/inventory
```

When using Docker, the database connection is configured in the `docker-compose.yml` file.

## Key Features

### Inventory Management Dashboard

The main dashboard (`/src/routes/+page.svelte`) provides two main views:

1. **Inventory Tab**:
   - Searchable table of all inventory items
   - Real-time filtering by ASIN, product name, location, condition, or status
   - Shows ASIN codes, product names, quantities, conditions, statuses, locations, and receive dates

2. **ASINs Tab**:
   - Expandable accordion view grouped by product types
   - Each product type shows:
     - Total inventory quantity across all ASINs
     - Number of locations containing the product
     - Last activity timestamp
     - Condition and status breakdowns
   - Expandable detail view shows:
     - Inventory summary statistics
     - Table of associated ASINs with individual statistics
     - Primary vs secondary ASIN designation

### Search Functionality

- **SuperAutoCombo component**: Advanced autocomplete search with categorized suggestions
- **Smart filtering**: Searches across multiple fields simultaneously
- **Live results**: Instant filtering as you type
- **Result counters**: Shows filtered vs total results

### Database Functions

Key functions in `/src/lib/db.ts`:

- `getProductTypesWithAsins()`: Returns product types with comprehensive inventory statistics
- `getAllInventoryItems()`: Returns all inventory with joined product and location data
- `addOrMergeinventoryItem()`: **Important**: Merges identical items (same ASIN, location, condition, status) instead of creating duplicates
- `getHoldingLocationWithContents()`: Returns the special holding location with current inventory
- `ensureHoldingLocation()`: Creates the holding location if it doesn't exist
- **Move Operations**:
  - `moveInventory()`: Core function for moving items between locations with partial quantity support
  - `pickInventory()`: Move items from storage locations to holding area
  - `stowInventory()`: Move items from holding area to storage locations
  - `decantInventory()`: Move items between storage locations with optional condition/status changes
  - `recordItemMove()`: Records all moves in the audit trail
- Inventory statistics calculated for both product types and individual ASINs

### Inventory Operations

The system provides three main inventory movement operations:

1. **Pick Operations** (`/pick`):
   - Move items from storage locations to holding area (or other destinations)
   - Form optimized for selecting items from shelves
   - Shows current holding area contents
   - Defaults to holding area but destination is changeable

2. **Stow Operations** (`/stow`):
   - Move items from holding area to storage locations
   - Shows clickable holding area contents for quick selection
   - Displays item details (condition, status, quantity) when selected
   - Optimized for quickly putting items away

3. **Decant Operations** (`/decant`):
   - Move items between any two storage locations
   - Optional condition and status changes during transfer
   - Useful for reorganizing inventory and consolidating locations
   - Prevents same-location moves

All operations:
- Support partial quantities by splitting inventory records
- Record moves in `item_moves_table` for full audit trail
- Merge items with identical properties automatically
- Include form validation and error handling
- Use `SuperAutoCombo` components for all location selections (supports barcode scanning)

### Special Locations

The system includes a special "Holding Area" location (`HOLDING_LOCATION_ID = '00000000-0000-0000-0000-133769420647'`) that represents items currently being held by the user. This location:

- Is displayed at the top of every page in the layout
- Should be used as the default destination for pick operations
- Should be used as the default source for stow operations
- Persists across browser sessions
- Is automatically created on app startup

## Coding Guidelines

### Naming Conventions

- **Variables**: Use `snake_case` for variable names in JavaScript/TypeScript files
- **Functions**: Use `snake_case` for function names
- **Types/Classes**: Use `PascalCase` for types, interfaces, and class names
- Database-related variables should follow snake_case to match database conventions

## Other Guidelines

- Add comments giving a broad overview of what your code does
- You can sign comments with '-CL', to differentiate between my comments and yours
- When working with Svelte 5, avoid `$derived.by()` for store access during SSR - use simple `$derived()` instead
- Always wrap browser-specific operations (like `goto()` and `$page` access) in `browser` checks to prevent hydration errors
- Use optional chaining (`?.`) and null coalescing (`||`) extensively to prevent crashes with undefined data
- When displaying data from server loads in layouts, always check for existence before calling array methods like `.reduce()`

### SSR Safety with Svelte 5

**Critical**: Never access `data` properties during component state initialization in Svelte 5, as this can cause SSR hydration errors and 500 responses.

❌ **Bad** - Can cause 500 errors:
```svelte
let selected_value = $state(data.some_property);
```

✅ **Good** - Safe for SSR:
```svelte
let selected_value = $state("");

$effect(() => {
    if (data?.some_property && !selected_value) {
        selected_value = data.some_property;
    }
});
```

Also use `$derived()` with safe guards for computed values:
```svelte
const options = $derived(() => {
    if (!data?.items) return [];
    return data.items.map(item => ({ value: item.id, label: item.name }));
});
```

### Server-Client Module Separation

**Never import server-side modules** (like `$lib/db`) in client-side Svelte components. This causes 500 errors because database connections and Node.js modules can't run in the browser.

❌ **Bad**:
```svelte
import { SOME_CONSTANT } from "$lib/db";
```

✅ **Good**:
```js
// In +page.server.ts
export const load = async () => {
    return {
        some_constant: db.SOME_CONSTANT
    };
};
```

```svelte
<!-- In +page.svelte -->
<script>
let { data } = $props();
// Use data.some_constant instead
</script>
```

## Documentation

The project includes reference documentation in the `/docs` directory:

- `skeleton-llms.txt`: Documentation for Skeleton UI library
- `svelte-llms-full.txt`: Full Svelte documentation for LLMs. Only use when
- `svelte-llms-medium.txt`: Medium-sized Svelte documentation for LLMs
- `docker-commands.md`: Reference for Docker commands
- `drizzle-constraints.md`: Reference for Drizzle ORM constraints
- `bits-ui-combobox.html`: Bits UI Combobox component documentation for Svelte 5

Like me, you're probably more familiar with Svelte v4. v5 has a lot of changes, so make sure to read the docs!
