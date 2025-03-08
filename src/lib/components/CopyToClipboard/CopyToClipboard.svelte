<script lang="ts">
  import { CopyIcon, CheckMarkIcon } from '../Icons';

  let isCopied = $state(false);
  let { valueToCopy }: { valueToCopy: string } = $props();
</script>

{#if isCopied}
  <CheckMarkIcon />
{:else}
  <button
    onclick={async () => {
      await navigator.clipboard.writeText(valueToCopy);
      isCopied = true;
      setTimeout(() => (isCopied = false), 1000);
    }}
  >
    <CopyIcon />
  </button>
{/if}

<style>
  button {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
