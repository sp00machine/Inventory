<script lang="ts">
    import type { PageProps } from "./$types";
    import SuperAutoCombo from "$lib/components/SuperAutoCombo.svelte";
    import { browser } from "$app/environment";

    let { data, form }: PageProps = $props();

    // Form state
    let selected_asin = $state("");
    let selected_from_location = $state("");
    let selected_to_location = $state("");
    let quantity = $state(1);
    let notes = $state("");

    // UI state
    let message = $state("");
    let error = $state("");
    let available_inventory = $state<any[]>([]);
    let max_quantity = $state(0);

    // Initialize selected destination to holding area when data loads
    $effect(() => {
        console.log("bloopity blop");
        if (data?.holding_location_id && !selected_to_location) {
            console.log("aye!");
            selected_to_location = data.holding_location_id;
            console.log("selected_to_location set to holding area:", selected_to_location);
        }else {
            console.log("nay!");
        }
    });

    // Update message/error when form is processed
    $effect(() => {
        if (form?.success) {
            message = form.message || "Pick completed successfully!";
            error = "";
            // Reset form on success
            selected_asin = "";
            selected_from_location = "";
            quantity = 1;
            notes = "";
            available_inventory = [];
            max_quantity = 0;
        } else if (form?.error) {
            error = form.error;
            message = "";
        }
    });

    // Auto-select ASIN if location has only one unique ASIN -CL
    $effect(() => {
        if (selected_from_location && !selected_asin && data?.inventory_items) {
            const items_at_location = data.inventory_items.filter(
                item => item.location_id === selected_from_location
            );
            const unique_asins = new Set(items_at_location.map(item => item.asin));
            if (unique_asins.size === 1) {
                selected_asin = Array.from(unique_asins)[0];
            }
        }
    });

    // Auto-select location if ASIN exists in only one location (excluding holding) -CL
    $effect(() => {
        if (selected_asin && !selected_from_location && data?.inventory_items) {
            const locations_with_asin = new Set(
                data.inventory_items
                    .filter(item => item.asin === selected_asin && item.location_id !== data.holding_location_id)
                    .map(item => item.location_id)
            );
            if (locations_with_asin.size === 1) {
                selected_from_location = Array.from(locations_with_asin)[0] ?? "";
            }
        }
    });

    // Update available inventory when ASIN or location changes
    $effect(() => {
        if (browser && selected_asin && selected_from_location) {
            updateAvailableInventory();
        } else {
            available_inventory = [];
            max_quantity = 0;
        }
    });

    async function updateAvailableInventory() {
        try {
            // Find inventory items for this ASIN at the selected location -CL
            const items = (data.inventory_items || []).filter(
                item => item.asin === selected_asin && item.location_id === selected_from_location
            );

            available_inventory = items;
            max_quantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
        }
    }

    // Filtered ASIN options based on selected location -CL
    const asin_options = $derived(() => {
        if (!data?.asins) return [];

        // If a location is selected, only show ASINs that have inventory there
        if (selected_from_location) {
            const asins_at_location = new Set(
                (data.inventory_items || [])
                    .filter(item => item.location_id === selected_from_location)
                    .map(item => item.asin)
            );

            return data.asins
                .filter(asin => asins_at_location.has(asin.asin))
                .map(asin => ({
                    value: asin.asin,
                    label: `${asin.asin} - ${asin.product_name ?? "Unknown Product"}`
                }));
        }

        // Otherwise show all ASINs
        return data.asins.map(asin => ({
            value: asin.asin,
            label: `${asin.asin} - ${asin.product_name ?? "Unknown Product"}`
        }));
    });

    // Filtered location options based on selected ASIN -CL
    const from_location_options = $derived(() => {
        if (!data?.locations) return [];

        // If an ASIN is selected, only show locations that have this ASIN
        if (selected_asin) {
            const locations_with_asin = new Set(
                (data.inventory_items || [])
                    .filter(item => item.asin === selected_asin)
                    .map(item => item.location_id)
            );

            return data.locations
                .filter(loc => loc.id !== data.holding_location_id && locations_with_asin.has(loc.id))
                .map(loc => ({ value: loc.id!, label: loc.name }));
        }

        // Otherwise show all locations except holding area
        return data.locations
            .filter(loc => loc.id !== data.holding_location_id)
            .map(loc => ({ value: loc.id!, label: loc.name }));
    });

    // Destination location options, with holding area first (safe for SSR) -CL
    const destination_options = $derived(() => {
        if (!data?.holding_location_id || !data?.locations) return [];

        return [
            { value: data.holding_location_id, label: "**Holding Area** (Default)" },
            ...data.locations
                .filter(loc => loc.id !== data.holding_location_id)
                .map(loc => ({ value: loc.id!, label: loc.name }))
        ];
    });
</script>

<div class="mx-auto w-full max-w-lg">
    <h1 class="text-2xl font-bold mb-4">Pick Inventory</h1>
    <p class="text-sm text-surface-600 mb-6">Move items from storage locations to your holding area or another location.</p>

    {#if message}
        <div class="alert variant-filled-success mb-4">
            <p>{message}</p>
        </div>
    {/if}

    {#if error}
        <div class="alert variant-filled-error mb-4">
            <p>{error}</p>
        </div>
    {/if}

    <form method="post" action="?" class="space-y-4">
        <!-- ASIN Selection -->
        <label class="label">
            <span class="label-text">ASIN/Barcode to Pick</span>
            <SuperAutoCombo
                bind:value={selected_asin}
                options={asin_options()}
            />
            <input type="hidden" name="asin" value={selected_asin} required />
        </label>

        <!-- Source Location -->
        <label class="label">
            <span class="label-text">Pick From Location</span>
            <SuperAutoCombo
                bind:value={selected_from_location}
                options={from_location_options()}
            />
            <input type="hidden" name="from_location_id" value={selected_from_location} required />
        </label>

        <!-- Available Inventory Display -->
        {#if selected_asin && selected_from_location}
            <div class="card p-4 bg-surface-100">
                <h3 class="text-sm font-semibold mb-2">Available at Location</h3>
                {#if max_quantity > 0}
                    <p class="text-sm text-success-600">Available: {max_quantity} units</p>
                {:else}
                    <p class="text-sm text-warning-600">No inventory found at this location</p>
                {/if}
            </div>
        {/if}

        <!-- Quantity -->
        <label class="label" for="quantity">
            <span class="label-text">Quantity to Pick</span>
            <input
                type="number"
                id="quantity"
                class="input"
                name="quantity"
                bind:value={quantity}
                min="1"
                max={max_quantity || undefined}
                required
            />
            {#if max_quantity > 0}
                <small class="text-xs text-surface-600">Max available: {max_quantity}</small>
            {/if}
        </label>

        <!-- Destination Location -->
        <label class="label">
            <span class="label-text">Destination</span>
            <SuperAutoCombo
                bind:value={selected_to_location}
                input_value={"**Holding Area** (Default)"}
                options={destination_options()}
            />
            <input type="hidden" name="to_location_id" value={selected_to_location} required />
        </label>

        <!-- Notes -->
        <label class="label" for="notes">
            <span class="label-text">Notes (Optional)</span>
            <textarea
                id="notes"
                class="input"
                name="notes"
                bind:value={notes}
                rows="2"
                placeholder="Any notes about this pick..."
            ></textarea>
        </label>

        <button
            type="submit"
            class="btn variant-filled-primary w-full"
            disabled={!selected_asin || !selected_from_location || quantity < 1}
        >
            Pick {quantity} Item{quantity !== 1 ? 's' : ''}
        </button>
    </form>

    <!-- Current Holding Area Contents
    {#if data.holding_location?.contents && data.holding_location.contents.length > 0}
        <div class="mt-8">
            <h2 class="text-lg font-semibold mb-3">Current Holding Area</h2>
            <div class="card p-4 space-y-2">
                {#each data.holding_location.contents as item}
                    <div class="flex justify-between items-center text-sm">
                        <span>{item.asin_code} - {item.product_name || 'Unknown'}</span>
                        <span class="badge variant-filled">{item.quantity}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if} -->
</div>