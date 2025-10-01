<script lang="ts">
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import type { InventoryLocation } from "../../db/schema";
    onMount(() => {
        // Component mounted
    });

    export let form; // This prop receives data returned from the form action
    export let locations: InventoryLocation[] = [];
</script>

<!-- Register New Location Form -->
<form
    method="post"
    use:enhance
    action="/receive/registerLocation"
    class="space-y-4 mt-4"
>
    <label class="label" for="name">
        <span class="label-text">Name</span>
        <input type="text" id="name" class="input" name="name" required />
    </label>

    <label class="label" for="description">
        <span class="label-text">Description</span>
        <textarea id="description" class="input" name="description" rows="3"
        ></textarea>
    </label>

    <label class="label" for="parent">
        <span class="label-text">Parent Location</span>
        <!-- using select for now, eventually autocomplete -->
        <select id="parent" class="input" name="parent">
            {#each locations as location}
                <option value={location.id}>{location.name}</option>
            {/each}
            <option value="">None</option>
        </select>
    </label>

    <button type="submit" class="btn variant-filled-primary w-full"
        >Register Location</button
    >

    {#if form?.success}
        <p style="color: green;">{form.message}</p>
    {:else if form?.message}
        <p style="color: red;">{form.message}</p>
    {/if}
</form>
