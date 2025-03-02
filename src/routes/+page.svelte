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
    RGBColors,
    RGBColorSwatch,
    RGBColorSwatchGray,
  } from '$lib';
  import type { Color } from '$lib/types';

  let primaryColor = $state<Color>(initialColor);
  let shouldShowHsl = $state(true);
  let shouldShowRgb = $state(false);
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
  <div class="scheme-options">
    <button
      onclick={() => {
        const newValue = !shouldShowHsl;
        if (!shouldShowRgb && !newValue) return;
        shouldShowHsl = !shouldShowHsl;
      }}
    >
      <span>HSL</span>
      {#if shouldShowHsl}
        <RGBColorSwatch />
      {:else}
        <RGBColorSwatchGray />
      {/if}
    </button>
    <button
      onclick={() => {
        const newValue = !shouldShowRgb;
        if (!shouldShowHsl && !newValue) return;
        shouldShowRgb = !shouldShowRgb;
      }}
    >
      <span>RGB</span>
      {#if shouldShowRgb}
        <RGBColorSwatch />
      {:else}
        <RGBColorSwatchGray />
      {/if}
    </button>
  </div>
  <div class="color-schemes">
    {#if shouldShowHsl}
      <HSLColors />
    {/if}
    {#if shouldShowRgb}
      <RGBColors />
    {/if}
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
    row-gap: 1rem;
  }

  h1 {
    text-align: center;
  }

  .current-color {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 0.5rem;
  }

  .scheme-options {
    display: flex;
    column-gap: 1rem;
  }

  button {
    display: flex;
    align-items: center;
    column-gap: 0.25rem;
  }

  .color-schemes {
    width: 100%;
    max-width: 40rem;
    display: flex;
    flex-direction: column;
    row-gap: 3rem;
  }
</style>
