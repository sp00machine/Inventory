<script lang="ts">
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import SuperAutoCombo from "./SuperAutoCombo.svelte";

    onMount(() => {
        // Component mounted
    });

    export let form; // This prop receives data returned from the form action
</script>

<!-- Register New ASIN Form -->
<form
    method="post"
    use:enhance
    action="/receive/registerASIN"
    class="space-y-4 mt-4"
>
    <label class="label" for="asin">
        <span class="label-text">ASIN/Barcode</span>
        <input type="text" id="asin" class="input" name="asin" required />
    </label>

    <label class="label" for="product_name">
        <!-- will also eventually be an autocomplete, if an existing product is chosen, the "is primary" checkbox should be unchecked -->
        <span class="label-text">Product Name</span>
        <input
            type="text"
            id="product_name"
            class="input"
            name="product_name"
            required
        />
    </label>

    <label class="label" for="description">
        <span class="label-text">Description</span>
        <textarea id="description" class="input" name="description" rows="3"
        ></textarea>
    </label>

    <label class="label flex items-center gap-2">
        <input type="checkbox" id="is_primary" name="is_primary" checked />
        <span class="label-text">Is Primary ASIN</span>
    </label>

    <button type="submit" class="btn variant-filled-primary w-full"
        >Register ASIN</button
    >

    {#if form?.success}
        <p style="color: green;">{form.message}</p>
    {:else if form?.message}
        <p style="color: red;">{form.message}</p>
    {/if}
</form>
