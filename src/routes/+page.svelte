<script lang="ts">
  import './styles.css';
  import {
    ColorChip,
    colorsStore,
    initialColor,
    colorToString,
    ColorFormat,
    HSLColors,
    HexColor,
  } from '$lib';
  import type { Color } from '$lib/types';

  let primaryColor = $state<Color>(initialColor);

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
  });
</script>

<div class="pickers">
  <h1>Advanced Color Palette</h1>
  <div class="current-color">
    <ColorChip color={colorToString(primaryColor, ColorFormat.HSL)} />
    <HexColor />
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
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .color-schemes {
    width: 100%;
    max-width: 40rem;
  }
</style>
