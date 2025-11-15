<script lang="ts">
    import type { PageProps } from "./$types";
    import SuperAutoCombo from "$lib/components/SuperAutoCombo.svelte";

    let { data, form }: PageProps = $props();

    // Form state
    let selected_asin = $state("");
    let selected_to_location = $state("");
    let quantity = $state(1);
    let notes = $state("");

    // UI state
    let message = $state("");
    let error = $state("");

    // -CL: Use $derived instead of $effect to avoid infinite loops when syncing state
    const selected_holding_item = $derived(
        selected_asin && data.holding_location?.contents
            ? data.holding_location.contents.find(item => item.asin === selected_asin)
            : null
    );

    const max_quantity = $derived(selected_holding_item?.quantity || 0);

    // Update message/error when form is processed
    $effect(() => {
        if (form?.success) {
            message = form.message || "Stow completed successfully!";
            error = "";
            // Reset form on success
            selected_asin = "";
            selected_to_location = "";
            quantity = 1;
            notes = "";
        } else if (form?.error) {
            error = form.error;
            message = "";
        }
    });

    // Auto-select first item in holding area -CL
    $effect(() => {
        if (!selected_asin && data.holding_location?.contents && data.holding_location.contents.length > 0) {
            selected_asin = data.holding_location.contents[0].asin;
        }
    });

    // Reset quantity if it exceeds max (side effect only) -CL
    $effect(() => {
        if (quantity > max_quantity && max_quantity > 0) {
            quantity = max_quantity;
        }
    });

    // Get available ASINs from holding area
    const holding_asins = data.holding_location?.contents?.map(item => ({
        value: item.asin,
        label: `${item.asin_code} - ${item.product_name || "Unknown Product"} (${item.quantity} available)`
    })) || [];

    // Destination locations (excluding holding area)
    const storage_locations = data.locations.filter(loc => loc.id !== data.holding_location_id);
</script>

<div class="mx-auto w-full max-w-lg">
    <h1 class="text-2xl font-bold mb-4">Stow Inventory</h1>
    <p class="text-sm text-surface-600 mb-6">Move items from your holding area to storage locations.</p>

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
    
    {#if holding_asins.length > 0}
        <form method="post" action="?" class="space-y-4">
            <!-- ASIN Selection from Holding Area -->
            <label class="label">
                <span class="label-text">Item to Stow</span>
                <SuperAutoCombo
                    bind:value={selected_asin}
                    options={holding_asins}
                    placeholder="Select or scan an ASIN"
                />
                <input type="hidden" name="asin" value={selected_asin} required />
            </label>

            <!-- Show selected item details -->
            {#if selected_holding_item}
                <div class="card p-4 bg-primary-50">
                    <h3 class="text-sm font-semibold mb-2">Selected Item</h3>
                    <p class="text-sm">{selected_holding_item.product_name || 'Unknown Product'}</p>
                    <p class="text-xs text-surface-600">Available: {max_quantity} units</p>
                    <p class="text-xs text-surface-600">Condition: {selected_holding_item.condition}</p>
                    <p class="text-xs text-surface-600">Status: {selected_holding_item.status}</p>
                </div>
            {/if}

            <!-- Quantity -->
            <label class="label" for="quantity">
                <span class="label-text">Quantity to Stow</span>
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
                <span class="label-text">Stow To Location</span>
                <SuperAutoCombo
                    bind:value={selected_to_location}
                    options={storage_locations.map(loc => ({ value: loc.id!, label: loc.name }))}
                    placeholder="Select or scan a location"
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
                    placeholder="Any notes about this stow..."
                ></textarea>
            </label>

            <button
                type="submit"
                class="btn variant-filled-primary w-full"
                disabled={!selected_asin || !selected_to_location || quantity < 1 || quantity > max_quantity}
            >
                Stow {quantity} Item{quantity !== 1 ? 's' : ''}
            </button>
        </form>
    {:else}
        <div class="text-center text-surface-600 mt-8">
            <p>No items available to stow</p>
            <a href="/pick" class="btn variant-filled-secondary mt-4">Go Pick Some Items</a>
        </div>
    {/if}
</div>