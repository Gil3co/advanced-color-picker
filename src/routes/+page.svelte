<script lang="ts">
  import './styles.css';
  import {
    ColorChip,
    colorsStore,
    initialColor,
    colorToString,
    ColorFormat,
    HSLColors,
    hexRegex,
  } from '$lib';
  import type { Color, Hex } from '$lib/types';
  import { CopyIcon } from '$lib/components/Icons';

  let primaryColor = $state<Color>(initialColor);

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
  });
</script>

<div class="pickers">
  <h1>Advanced Color Palette</h1>
  <div class="current-color">
    <ColorChip color={colorToString(primaryColor, ColorFormat.HSL)} />
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
      <button
        onclick={async () => {
          await navigator.clipboard.writeText(primaryColor.hex);
        }}
      >
        <CopyIcon />
      </button>
    </div>
  </div>

  <div class="color-schemes">
    <HSLColors />
  </div>
</div>

<style>
  .pickers {
    margin: 0 15rem;
    background-color: white;
    padding: 1rem;
    border-radius: 12px;
  }

  h1 {
    text-align: center;
  }

  .current-color {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .hex-container {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
  }

  .hex {
    background-color: #e5e5e6;
    border: none;
    text-align: center;
    border-radius: 4px;
    width: 4.5rem;
  }

  button {
    width: 1rem;
    height: 1rem;
  }
  .color-schemes {
  }
</style>
