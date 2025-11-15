<script lang="ts">
  import { Combobox } from "bits-ui";
  import { untrack } from "svelte";

  interface Props {
    options: {value: string, label: string}[];
    all_values?: {value: string, label: string}[];  // All valid values for direct input (scanning) -CL
    value?: string;  // Currently selected ID (the "real" value)
    placeholder?: string;  // Optional initial placeholder text
  }

  let { options, all_values, value = $bindable(), placeholder = "Select or scan" }: Props = $props();

  // -CL: Internal state for the input field - allows user typing for filtering
  let internal_input_value = $state("");
  let prev_value = $state(value);
  let is_open = $state(false);  // Control dropdown open state

  // -CL: Only track `value` changes, not `options` changes (prevents effect reruns when options array is recreated)
  // This syncs display when value is set programmatically (e.g., auto-select or scanning)
  $effect(() => {
    // Only run if value actually changed to a different value
    if (value !== prev_value) {
      if (value) {
        // Use untrack to read options without subscribing to it
        // Check options first, then fall back to all_values for scanned items -CL
        const selected_option = untrack(() =>
          options.find(o => o.value === value) ||
          all_values?.find(o => o.value === value)
        );
        if (selected_option) {
          internal_input_value = selected_option.label;
        } else {
          // Value set but not found in any list - just show the raw value -CL
          internal_input_value = value;
        }
      } else {
        internal_input_value = "";
      }
      prev_value = value;
    }
  });

  // -CL: Filter options based on what user types
  const filtered_options = $derived(
    internal_input_value === "" || internal_input_value === options.find(o => o.value === value)?.label
      ? options // If the input is empty, or if an actual option is selected, show all options
      : options.filter((o) => // Otherwise, the user is searching - filter options
          o.label.toLowerCase().includes(internal_input_value.toLowerCase()) ||
          o.value.toLowerCase().includes(internal_input_value.toLowerCase()),
        ),
  );
</script>

<!-- {#each options as opt}
  <div class="e">{opt.value} - {opt.label}</div>
{/each} -->

<!-- debug display selected value and label -->
{#if true}
  <div class="mb-2 text-sm text-muted-foreground">
    Selected value: {value} (
    {options.find(o => o.value === value)?.label ?? "none"})
  </div>
{/if}


<Combobox.Root
  type="single"
  name="super-auto-combo"
  bind:value
  bind:open={is_open}
  inputValue={internal_input_value}
>
  <div class="relative">
    <Combobox.Input
      class="h-input rounded-9px border-border-input bg-background placeholder:text-foreground-alt/50 focus:ring-foreground focus:ring-offset-background focus:outline-hidden inline-flex w-[296px] touch-none truncate border px-11 text-base transition-colors focus:ring-2 focus:ring-offset-2 sm:text-sm"
      placeholder={placeholder}
      aria-label={placeholder}
      oninput={(e) => internal_input_value = e.currentTarget.value}
      onclick={() => is_open = true}
      autocomplete="off"
    />
    <Combobox.Trigger
      class="absolute end-3 top-1/2 size-6 -translate-y-1/2 touch-none hidden"
    >
      <!-- <CaretUpDown class="text-muted-foreground size-6" /> -->
    </Combobox.Trigger>
  </div>
  <Combobox.Portal>
    <Combobox.Content
      class="focus-override border-muted bg-white shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-96 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
      sideOffset={10}
    >
      <Combobox.ScrollUpButton
        class="flex w-full items-center justify-center py-1"
      >
        <!-- <CaretDoubleUp class="size-3" /> -->
      </Combobox.ScrollUpButton>
      <Combobox.Viewport class="p-1">
        {#each filtered_options as option, i (i + option.value)}
          <Combobox.Item
            class="hover:bg-neutral-400 rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
            value={option.value}
            label={option.label}
          >
            {#snippet children({ selected })}
              {option.label}
              {#if selected}
                <div class="ml-auto">
                  <!-- <Check /> -->
                </div>
              {/if}
            {/snippet}
          </Combobox.Item>
        {:else}
          <span class="block px-5 py-2 text-sm text-muted-foreground">
            No results found, try again.
          </span>
        {/each}
      </Combobox.Viewport>
      <Combobox.ScrollDownButton
        class="flex w-full items-center justify-center py-1"
      >
        <!-- <CaretDoubleDown class="size-3" /> -->
      </Combobox.ScrollDownButton>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
