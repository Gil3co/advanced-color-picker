<script lang="ts">
  import { ColorFormat, hueValues } from '$lib/consts';
  import { calculateHslBg } from '$lib/helpers';
  import { colorsStore, initialColor } from '$lib/stores';
  import { ColorSlider } from '../ColorSlider';
  import type { Color, HSL, OnInputEvent } from '$lib/types';

  let primaryColor = $state<Color>(initialColor);

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
  });

  const hslOnInput =
    (key: keyof HSL) =>
    ({ currentTarget: { value } }: OnInputEvent) => {
      colorsStore.updateColors(ColorFormat.HSL, {
        ...primaryColor.hsl,
        [key]: parseFloat(value),
      });
    };
</script>

<div class="colors">
  <ColorSlider
    value={primaryColor.hsl.hue}
    onInput={hslOnInput('hue')}
    maxValue={360}
    bgColor={calculateHslBg({
      hue: hueValues,
      steps: 360,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.hsl.saturation}
    onInput={hslOnInput('saturation')}
    maxValue={100}
    bgColor={calculateHslBg({
      saturation: ['0%', '100%'],
      steps: 2,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.hsl.lightness}
    onInput={hslOnInput('lightness')}
    maxValue={100}
    bgColor={calculateHslBg({
      lightness: ['0%', '50%', '100%'],
      steps: 3,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.hsl.alpha}
    onInput={hslOnInput('alpha')}
    maxValue={1}
    step={0.01}
    bgColor={calculateHslBg({
      alpha: [0, 1],
      steps: 2,
      colorFromColorsStore: primaryColor,
    })}
  />
</div>

<style>
  .colors {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }
</style>
