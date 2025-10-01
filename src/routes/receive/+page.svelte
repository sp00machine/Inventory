<script lang="ts">
    import { Tabs } from "@skeletonlabs/skeleton-svelte";
    import type { PageProps } from "./$types";
    import RegisterAsin from "$lib/components/RegisterAsin.svelte";
    import RegisterLocation from "$lib/components/RegisterLocation.svelte";
    import SuperAutoCombo from "$lib/components/SuperAutoCombo.svelte";
  import { Label } from "bits-ui";

    let { data, form }: PageProps = $props();
    let activeTab = $state("receive");

    // State for form feedback
    let message = $state("");
    let error = $state("");
    
    // State for SuperAutoCombo
    let selected_asin_id = $state("");
    let selected_location_id = $state("");

    // Update message/error when form is processed
    $effect(() => {
        if (form?.success) {
            message = form.message || "Operation completed successfully!";
            error = "";
        } else if (form?.error) {
            error = form.error;
            message = "";
        }
    });
</script>

<div class="mx-auto w-full max-w-md">
    <h1 class="text-2xl font-bold mb-4">Receive Inventory</h1>

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

    <Tabs value={activeTab} onValueChange={(e) => (activeTab = e.value)}>
        {#snippet list()}
            <Tabs.Control value="receive">Receive Items</Tabs.Control>
            <Tabs.Control value="register">Register New ASIN</Tabs.Control>
            <Tabs.Control value="locations">Register New Location</Tabs.Control>
        {/snippet}

        {#snippet content()}
            <Tabs.Panel value="receive">
                <!-- Receive Items Form -->
                <form method="post" action="?" class="space-y-4 mt-4">
                    <label class="label">
                        <span class="label-text">ASIN/Barcode</span>
                        <SuperAutoCombo 
                            bind:value={selected_asin_id}
                            options={data.asins.map(as => ({ value: as.asin, label: `${as.asin} - ${as.product_name ?? "Unknown Product"}` }))} 
                        />
                        <input type="hidden" name="asin" value={selected_asin_id} required />
                    </label>

                    <label class="label" for="quantity">
                        <span class="label-text">Quantity</span>
                        <input
                            type="number"
                            id="quantity"
                            class="input"
                            name="quantity"
                            value="1"
                            min="1"
                            required
                        />
                    </label>

                    <label class="label" for="condition">
                        <span class="label-text">Condition</span>
                        <select id="condition" name="condition" class="input">
                            <option value="new">New</option>
                            <option value="used">Used</option>
                            <option value="damaged">Damaged</option>
                        </select>
                    </label>

                    <label class="label">
                        <span class="label-text">Location</span>
                        <SuperAutoCombo
                            bind:value={selected_location_id}
                            options={(data.locations || []).map(loc => ({ value: loc.id!, label: loc.name }))}
                        />
                        <input type="hidden" name="locationID" value={selected_location_id} required />
                    </label>

                    <button
                        type="submit"
                        class="btn variant-filled-primary w-full"
                        >Receive Item</button
                    >
                </form>
            </Tabs.Panel>
            <Tabs.Panel value="register">
                <RegisterAsin form={null} />
            </Tabs.Panel>
            <Tabs.Panel value="locations">
                <RegisterLocation form={null} locations={data.locations} />
            </Tabs.Panel>
        {/snippet}
    </Tabs>
</div>
