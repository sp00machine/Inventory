<script lang="ts">
	import "../app.css";
	import { Navigation } from "@skeletonlabs/skeleton-svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { applyAction } from "$app/forms";
	import type { LayoutProps } from "./$types";


	// Get the current URL subpath, using the page store instead of window
	let value = $derived(browser ? $page.url.pathname.split("/").pop() || "" : "");

	let { data, children }: LayoutProps = $props();
</script>

<!-- App Selection -->
<div class="flex flex-col h-screen justify-between">
	<!-- Currently held items -->
	<div class="alert variant-filled-tertiary rounded-none p-3">
		<div class="flex items-center gap-3">
			<!-- Holding icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-4 flex-shrink-0"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313L12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313L12 21.75l-2.25-1.313M12 21.75V19.5m0 2.25l2.25-1.313M12 21.75l-2.25-1.313"
				/>
			</svg>

			<!-- Content -->
			<div class="flex-1">
				{#if data.holding && data.holding.contents && data.holding.contents.length > 0}
					<div class="flex flex-wrap items-center gap-x-4 gap-y-1">
						<span class="font-medium">Currently Holding:</span>
						{#each data.holding.contents as item}
							<div class="inline-flex items-center gap-1">
								<span class="badge variant-filled-surface text-xs px-2 py-1">
									{item.product_name}
									{#if item.quantity ?? Infinity > 1}
										<span class="opacity-75">×{item.quantity}</span>
									{/if}
								</span>
								{#if item.condition !== 'new'}
									<span class="text-xs opacity-75">({item.condition})</span>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<span class="opacity-75">No items currently being held</span>
				{/if}
			</div>

			<!-- Count indicator -->
			{#if data.holding && data.holding.contents && data.holding.contents.length > 0}
				<div class="badge variant-filled-primary">
					{data.holding.contents.reduce((sum, item) => sum + (item.quantity || 0), 0)}
				</div>
			{/if}
		</div>
	</div>

	<!-- Content -->
	<div class="flex items-center justify-center">
		<!-- <pre class="pre">value: {value}</pre> -->
		{@render children()}
	</div>
	<!-- Pinned to bottom of screen -->
	<Navigation.Bar
		{value}
		onValueChange={(newValue) => {
			if (browser && newValue !== value) {
				goto(`/${newValue}`);
			}
		}}
	>
		<Navigation.Tile id="receive" label="Receive">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 4.5v15m7.5-7.5h-15"
				/>
			</svg>
		</Navigation.Tile>
		<Navigation.Tile id="pick" label="Pick">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
				/>
			</svg>
		</Navigation.Tile>
		<Navigation.Tile id="" label="Explore">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
				/>
			</svg>
		</Navigation.Tile>
		<Navigation.Tile id="stow" label="Stow">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
				/>
			</svg>
		</Navigation.Tile>
		<Navigation.Tile id="decant" label="Decant">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
				/>
			</svg>
		</Navigation.Tile>
	</Navigation.Bar>
</div>
