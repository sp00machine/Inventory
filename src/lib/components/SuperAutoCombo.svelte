<script lang="ts">
  import { Combobox } from "bits-ui";

  interface Props {
    label?: string;
    options: {value: string, label: string}[];
    value?: string;
    input_value?: string;
  }

  let { label = "Search or scan an ASIN", options, value = $bindable(), input_value = $bindable() }: Props = $props();

  // -CL: bits-ui doesn't expose inputValue as bindable on Root, so we need to manage it ourselves
  // and sync it via the Input component's oninput event
  const filtered_options = $derived(
    input_value === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes((input_value??"").toLowerCase()) || o.value.toLowerCase().includes((input_value??"").toLowerCase()),
        ),
  );
</script>

<!-- {#each options as opt}
  <div class="e">{opt.value} - {opt.label}</div>
{/each} -->

!!selected id = {value}
<Combobox.Root
  type="single"
  name="super-auto-combo"
  bind:value
  inputValue={input_value}
>
  <div class="relative">
    <!-- <OrangeSlice
      class="text-muted-foreground absolute start-3 top-1/2 size-6 -translate-y-1/2"
    /> -->
    <Combobox.Input
      class="h-input rounded-9px border-border-input bg-background placeholder:text-foreground-alt/50 focus:ring-foreground focus:ring-offset-background focus:outline-hidden inline-flex w-[296px] touch-none truncate border px-11 text-base transition-colors focus:ring-2 focus:ring-offset-2 sm:text-sm"
      placeholder={label}
      aria-label={label}
      oninput={(e) => input_value = e.currentTarget.value}
    />
    <Combobox.Trigger
      class="absolute end-3 top-1/2 size-6 -translate-y-1/2 touch-none"
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
            class="rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
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
