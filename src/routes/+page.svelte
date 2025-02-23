<script lang="ts">
  import {
    ColorChip,
    colorsStore,
    initialColor,
    colorToString,
    ColorFormat,
    HSLColors,
  } from '$lib';
  import type { Color } from '$lib/types';

  let primaryColor = $state<Color>(initialColor);

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
  });
</script>

<h1>Advanced Color Palette</h1>
<ColorChip color={colorToString(primaryColor, ColorFormat.HSL)} />
<p>
  {colorToString(primaryColor, ColorFormat.Hex)}
</p>

<HSLColors />
