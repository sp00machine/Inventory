<script lang="ts">
  import { Combobox } from "bits-ui";
  import SACEntry from "./SACEntry.svelte";
  
  export let option: {value: string, label: string, parent_value?: string, children: any[], valid?: boolean, hidden?: boolean};
  export let nest_level = 0;

</script>

{#if !option.hidden}
<Combobox.Item
disabled={option.valid === false}
class="pl-{4 + (nest_level * 2)} hover:bg-neutral-400 rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pr-1.5 text-sm capitalize"
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

{#each option.children ?? [] as child_option}
  <SACEntry option={child_option} nest_level={nest_level + 1} />
{/each}
{/if}
