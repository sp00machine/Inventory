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
    let new_condition = $state("");
    let new_status = $state("");
    let notes = $state("");

    // UI state
    let message = $state("");
    let error = $state("");
    let available_inventory = $state<any[]>([]);
    let max_quantity = $state(0);

    // Update message/error when form is processed
    $effect(() => {
        if (form?.success) {
            message = form.message || "Decant completed successfully!";
            error = "";
            // Reset form on success
            selected_asin = "";
            selected_from_location = "";
            selected_to_location = "";
            quantity = 1;
            new_condition = "";
            new_status = "";
            notes = "";
            available_inventory = [];
            max_quantity = 0;
        } else if (form?.error) {
            error = form.error;
            message = "";
        }
    });

    // Update available inventory when ASIN or source location changes
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
            // In a real app, we'd fetch this from the server
            // This would be better as a server endpoint for real-time data
            available_inventory = []; // Placeholder - would need server endpoint
            max_quantity = 0; // Placeholder
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
        }
    }

    // Condition options
    const condition_options = [
        { value: "", label: "Keep current condition" },
        { value: "new", label: "New" },
        { value: "used", label: "Used" },
        { value: "damaged", label: "Damaged" }
    ];

    // Status options
    const status_options = [
        { value: "", label: "Keep current status" },
        { value: "available", label: "Available" },
        { value: "reserved", label: "Reserved" },
        { value: "shipped", label: "Shipped" },
        { value: "missing", label: "Missing" }
    ];
</script>

<div class="mx-auto w-full max-w-lg">
    <h1 class="text-2xl font-bold mb-4">Decant Inventory</h1>
    <p class="text-sm text-surface-600 mb-6">Move items between storage locations, optionally changing condition or status.</p>

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
            <span class="label-text">ASIN/Barcode to Move</span>
            <SuperAutoCombo
                bind:value={selected_asin}
                options={data.asins.map(asin => ({
                    value: asin.asin,
                    label: `${asin.asin} - ${asin.product_name ?? "Unknown Product"}`
                }))}
            />
            <input type="hidden" name="asin" value={selected_asin} required />
        </label>

        <!-- Source Location -->
        <label class="label">
            <span class="label-text">Move From Location</span>
            <SuperAutoCombo
                bind:value={selected_from_location}
                options={data.locations.map(loc => ({ value: loc.id!, label: loc.name }))}
            />
            <input type="hidden" name="from_location_id" value={selected_from_location} required />
        </label>

        <!-- Destination Location -->
        <label class="label">
            <span class="label-text">Move To Location</span>
            <SuperAutoCombo
                bind:value={selected_to_location}
                options={data.locations
                    .filter(loc => loc.id !== selected_from_location)
                    .map(loc => ({ value: loc.id!, label: loc.name }))}
            />
            <input type="hidden" name="to_location_id" value={selected_to_location} required />
        </label>

        <!-- Available Inventory Display -->
        {#if selected_asin && selected_from_location}
            <div class="card p-4 bg-surface-100">
                <h3 class="text-sm font-semibold mb-2">Available at Source Location</h3>
                {#if max_quantity > 0}
                    <p class="text-sm text-success-600">Available: {max_quantity} units</p>
                {:else}
                    <p class="text-sm text-warning-600">No inventory found at this location</p>
                {/if}
            </div>
        {/if}

        <!-- Quantity -->
        <label class="label" for="quantity">
            <span class="label-text">Quantity to Move</span>
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

        <!-- Optional Condition Change -->
        <label class="label" for="new_condition">
            <span class="label-text">New Condition (Optional)</span>
            <select
                id="new_condition"
                name="new_condition"
                class="input"
                bind:value={new_condition}
            >
                {#each condition_options as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </label>

        <!-- Optional Status Change -->
        <label class="label" for="new_status">
            <span class="label-text">New Status (Optional)</span>
            <select
                id="new_status"
                name="new_status"
                class="input"
                bind:value={new_status}
            >
                {#each status_options as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
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
                placeholder="Any notes about this decant operation..."
            ></textarea>
        </label>

        <button
            type="submit"
            class="btn variant-filled-primary w-full"
            disabled={!selected_asin || !selected_from_location || !selected_to_location || quantity < 1}
        >
            Decant {quantity} Item{quantity !== 1 ? 's' : ''}
        </button>
    </form>

    <!-- Information Box -->
    <div class="card p-4 mt-6 bg-surface-50">
        <h3 class="text-sm font-semibold mb-2">About Decanting</h3>
        <p class="text-xs text-surface-600">
            Decanting moves items between storage locations. Use this when reorganizing inventory,
            consolidating locations, or changing item conditions/status during transfer.
        </p>
    </div>
</div>