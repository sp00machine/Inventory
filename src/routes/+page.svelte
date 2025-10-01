<script lang="ts">
  import type { PageProps } from "./$types";
  import { Tabs, Accordion } from "@skeletonlabs/skeleton-svelte";
  import SuperAutoCombo from "$lib/components/SuperAutoCombo.svelte";

  let { data }: PageProps = $props();

  let tab = $state("inventory");
  let accordion_value = $state<string[]>([]);

  // Search functionality for inventory tab -CL
  let inventory_search_value = $state("");

  // Search functionality for ASINs tab -CL
  let asins_search_value = $state("");

  // Create search options for inventory tab -CL
  const inventory_search_options = $derived.by(() => {
    if (!data.inventoryItems) return [];

    const options = new Set<{value: string, label: string}>();

    data.inventoryItems.forEach(item => {
      // Add ASIN codes
      if (item.asin_code) {
        options.add({
          value: item.asin_code,
          label: `ASIN: ${item.asin_code}`
        });
      }

      // Add product names
      if (item.product_name) {
        options.add({
          value: item.product_name,
          label: `Product: ${item.product_name}`
        });
      }

      // Add locations
      if (item.location_name) {
        options.add({
          value: item.location_name,
          label: `Location: ${item.location_name}`
        });
      }

      // Add conditions
      if (item.condition) {
        options.add({
          value: item.condition,
          label: `Condition: ${item.condition}`
        });
      }

      // Add statuses
      if (item.status) {
        options.add({
          value: item.status,
          label: `Status: ${item.status}`
        });
      }
    });

    return Array.from(options);
  });

  // Create search options for ASINs tab -CL
  const asins_search_options = $derived.by(() => {
    if (!data.productTypesWithAsins) return [];

    const options = new Set<{value: string, label: string}>();

    data.productTypesWithAsins.forEach(productType => {
      // Add product type names
      if (productType.name) {
        options.add({
          value: productType.name,
          label: `Product: ${productType.name}`
        });
      }

      // Add product type descriptions
      if (productType.description) {
        options.add({
          value: productType.description,
          label: `Description: ${productType.description}`
        });
      }

      // Add ASINs
      if (productType.asins) {
        productType.asins.forEach(asin => {
          options.add({
            value: asin.asin,
            label: `ASIN: ${asin.asin}`
          });
        });
      }
    });

    return Array.from(options);
  });

  // Filter inventory items based on search -CL
  const filtered_inventory_items = $derived.by(() => {
    if (!data.inventoryItems || !inventory_search_value) return data.inventoryItems;

    const search_term = inventory_search_value.toLowerCase();

    return data.inventoryItems.filter(item =>
      item.asin_code?.toLowerCase().includes(search_term) ||
      item.product_name?.toLowerCase().includes(search_term) ||
      item.location_name?.toLowerCase().includes(search_term) ||
      item.condition?.toLowerCase().includes(search_term) ||
      item.status?.toLowerCase().includes(search_term)
    );
  });

  // Filter product types based on search -CL
  const filtered_product_types = $derived.by(() => {
    if (!data.productTypesWithAsins || !asins_search_value) return data.productTypesWithAsins;

    const search_term = asins_search_value.toLowerCase();

    return data.productTypesWithAsins.filter(productType =>
      productType.name?.toLowerCase().includes(search_term) ||
      productType.description?.toLowerCase().includes(search_term) ||
      productType.asins?.some(asin => asin.asin.toLowerCase().includes(search_term))
    );
  });
</script>

<Tabs value={tab} onValueChange={(e) => (tab = e.value)}>
  {#snippet list()}
    <Tabs.Control value="inventory">Inventory</Tabs.Control>
    <Tabs.Control value="asins">ASINs</Tabs.Control>
  {/snippet}
  {#snippet content()}
    <Tabs.Panel value="inventory">
      <!-- Display inventory items in a table -->
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-2xl font-bold">Inventory Items</h1>
            {#if inventory_search_value}
              <p class="text-sm text-gray-600">
                Showing {filtered_inventory_items?.length || 0} of {data.inventoryItems?.length || 0} items
              </p>
            {/if}
          </div>
          <div class="w-80">
            <SuperAutoCombo
              label="Search inventory (ASIN, product, location, etc.)"
              options={inventory_search_options}
              bind:value={inventory_search_value}
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ASIN</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Location</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {#if filtered_inventory_items && filtered_inventory_items.length > 0}
                {#each filtered_inventory_items as item}
                  <tr>
                    <td>{item.asin_code || "N/A"}</td>
                    <td>{item.product_name || "Unknown"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.condition}</td>
                    <td>{item.status}</td>
                    <td>{item.location_name || "Unlocated"}</td>
                    <td
                      >{item.date_received
                        ? new Date(item.date_received).toLocaleDateString()
                        : "N/A"}</td
                    >
                  </tr>
                {/each}
              {:else}
                <tr>
                  <td colspan="7" class="text-center py-4">
                    {#if inventory_search_value}
                      No inventory items match your search "{inventory_search_value}"
                    {:else}
                      No inventory items found
                    {/if}
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </Tabs.Panel>
    <Tabs.Panel value="asins">
      <!-- Product types with expandable ASIN lists -CL -->
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-2xl font-bold">Product Types & ASINs</h1>
            {#if asins_search_value}
              <p class="text-sm text-gray-600">
                Showing {filtered_product_types?.length || 0} of {data.productTypesWithAsins?.length || 0} product types
              </p>
            {/if}
          </div>
          <div class="w-80">
            <SuperAutoCombo
              label="Search products and ASINs"
              options={asins_search_options}
              bind:value={asins_search_value}
            />
          </div>
        </div>

        {#if filtered_product_types && filtered_product_types.length > 0}
          <Accordion value={accordion_value} onValueChange={(e) => (accordion_value = e.value)} multiple>
            {#each filtered_product_types as productType}
              <Accordion.Item value={productType.id}>
                {#snippet control()}
                  <div class="flex justify-between items-center w-full">
                    <div class="flex-1">
                      <div class="flex items-center gap-3">
                        <span class="font-semibold">{productType.name || "Unnamed Product"}</span>
                        {#if productType.stats?.total_quantity > 0}
                          <span class="badge variant-filled-success">
                            {productType.stats.total_quantity} items
                          </span>
                        {:else}
                          <span class="badge variant-filled-warning">0 items</span>
                        {/if}
                      </div>
                      {#if productType.description}
                        <div class="text-sm text-gray-600 mt-1">{productType.description}</div>
                      {/if}
                      <div class="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span>{productType.asins?.length || 0} ASIN{(productType.asins?.length || 0) !== 1 ? 's' : ''}</span>
                        {#if productType.stats?.unique_locations?.length > 0}
                          <span>📍 {productType.stats.unique_locations.length} location{productType.stats.unique_locations.length !== 1 ? 's' : ''}</span>
                        {/if}
                        {#if productType.stats?.last_received}
                          <span>📅 Last: {new Date(productType.stats.last_received).toLocaleDateString()}</span>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/snippet}
                {#snippet panel()}
                  <div class="mt-4">
                    <!-- Product type summary statistics -CL -->
                    {#if productType.stats?.total_quantity > 0}
                      <div class="bg-surface-100-800-token p-4 rounded-lg mb-6">
                        <h4 class="font-semibold mb-3">Inventory Summary</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <!-- Total quantity and locations -->
                          <div>
                            <div class="text-sm text-gray-600">Total Items</div>
                            <div class="text-lg font-semibold">{productType.stats?.total_quantity || 0}</div>
                            {#if productType.stats?.unique_locations?.length > 0}
                              <div class="text-xs text-gray-500">
                                In {productType.stats.unique_locations.length} location{productType.stats.unique_locations.length !== 1 ? 's' : ''}
                              </div>
                            {/if}
                          </div>

                          <!-- Condition breakdown -->
                          <div>
                            <div class="text-sm text-gray-600">Condition</div>
                            {#if Object.keys(productType.stats?.condition_breakdown || {}).length > 0}
                              <div class="flex flex-wrap gap-1 mt-1">
                                {#each Object.entries(productType.stats.condition_breakdown) as [condition, count]}
                                  <span class="badge variant-soft text-xs">{condition}: {count}</span>
                                {/each}
                              </div>
                            {:else}
                              <div class="text-sm text-gray-400">—</div>
                            {/if}
                          </div>

                          <!-- Status breakdown -->
                          <div>
                            <div class="text-sm text-gray-600">Status</div>
                            {#if Object.keys(productType.stats?.status_breakdown || {}).length > 0}
                              <div class="flex flex-wrap gap-1 mt-1">
                                {#each Object.entries(productType.stats.status_breakdown) as [status, count]}
                                  <span class="badge variant-soft text-xs">{status}: {count}</span>
                                {/each}
                              </div>
                            {:else}
                              <div class="text-sm text-gray-400">—</div>
                            {/if}
                          </div>
                        </div>

                        <!-- Locations list -->
                        {#if productType.stats?.unique_locations?.length > 0}
                          <div class="mt-3">
                            <div class="text-sm text-gray-600">Locations:</div>
                            <div class="flex flex-wrap gap-1 mt-1">
                              {#each productType.stats.unique_locations as location}
                                <span class="badge variant-soft text-xs">📍 {location}</span>
                              {/each}
                            </div>
                          </div>
                        {/if}
                      </div>
                    {/if}

                    {#if productType.asins?.length > 0}
                      <div class="overflow-x-auto">
                        <table class="table table-hover">
                          <thead>
                            <tr>
                              <th>ASIN</th>
                              <th>Type</th>
                              <th>Quantity</th>
                              <th>Locations</th>
                              <th>Status</th>
                              <th>Last Activity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each productType.asins as asin}
                              <tr>
                                <td class="font-mono text-sm">{asin.asin}</td>
                                <td>
                                  {#if asin.is_primary}
                                    <span class="badge variant-filled-primary">Primary</span>
                                  {:else}
                                    <span class="badge variant-soft">Secondary</span>
                                  {/if}
                                </td>
                                <td>
                                  {#if asin.stats?.total_quantity > 0}
                                    <span class="badge variant-filled-success">{asin.stats.total_quantity}</span>
                                  {:else}
                                    <span class="badge variant-filled-surface">0</span>
                                  {/if}
                                </td>
                                <td class="text-sm">
                                  {#if asin.stats?.locations?.length > 0}
                                    <div class="flex flex-wrap gap-1">
                                      {#each asin.stats.locations as location}
                                        <span class="badge variant-soft text-xs">{location}</span>
                                      {/each}
                                    </div>
                                  {:else}
                                    <span class="text-gray-400">No location</span>
                                  {/if}
                                </td>
                                <td class="text-sm">
                                  {#if Object.keys(asin.stats?.status_breakdown || {}).length > 0}
                                    <div class="flex flex-wrap gap-1">
                                      {#each Object.entries(asin.stats.status_breakdown) as [status, count]}
                                        <span class="badge variant-soft text-xs">
                                          {status}: {count}
                                        </span>
                                      {/each}
                                    </div>
                                  {:else}
                                    <span class="text-gray-400">—</span>
                                  {/if}
                                </td>
                                <td class="text-sm text-gray-600">
                                  {#if asin.stats?.last_received}
                                    {new Date(asin.stats.last_received).toLocaleDateString()}
                                  {:else}
                                    <span class="text-gray-400">—</span>
                                  {/if}
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    {:else}
                      <p class="text-gray-500 italic">No ASINs associated with this product type</p>
                    {/if}
                  </div>
                {/snippet}
              </Accordion.Item>
              <hr class="hr" />
            {/each}
          </Accordion>
        {:else}
          <p class="text-center py-4 text-gray-500">
            {#if asins_search_value}
              No product types or ASINs match your search "{asins_search_value}"
            {:else}
              No product types found
            {/if}
          </p>
        {/if}
      </div>
	</Tabs.Panel>
  {/snippet}
</Tabs>
