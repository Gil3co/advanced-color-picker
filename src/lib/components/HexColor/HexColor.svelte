<script lang="ts">
  import { ColorFormat, hexRegex } from '$lib/consts';
  import { colorsStore, initialColor } from '$lib/stores';
  import type { Color, Hex } from '$lib/types';
  import { CopyToClipboard } from '../CopyToClipboard';

  let primaryColor = $state<Color>(initialColor);

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
  });
</script>

<div class="hex-container">
  <input
    class="hex"
    value={primaryColor.hex}
    oninput={({ currentTarget: { value } }) => {
      if (hexRegex.test(value)) {
        colorsStore.updateColors(ColorFormat.Hex, value as Hex);
      }
    }}
  />
  <CopyToClipboard valueToCopy={primaryColor.hex} />
</div>

<style>
  .hex-container {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
  }

  .hex {
    background-color: #e5e5e6;
    text-align: center;
    border-radius: 4px;
    width: 5rem;
  }
</style>
