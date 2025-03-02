<script lang="ts">
  import { ColorFormat, hslMaxValuePerKey, hueValues } from '$lib/consts';
  import {
    calculateHslBg,
    colorToString,
    parseHslaStringToHsla,
    validateHsl,
  } from '$lib/helpers';
  import { colorsStore, initialColor } from '$lib/stores';
  import type { Color, HSL, OnInputEvent } from '$lib/types';
  import { ColorSlider } from '../ColorSlider';
  import { CopyToClipboard } from '../CopyToClipboard';

  const hslaRegex =
    /^hsla?\(\s*(\d{1,3})\s+(\d{1,3}%)\s+(\d{1,3}%)(\s*\/\s*(0?\.?\d+|1(\.0)?))?\s*\)$/;

  let primaryColor = $state<Color>(initialColor);
  let colorString = $state(colorToString(initialColor, ColorFormat.HSL));

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
    colorString = colorToString(storeValue.primaryColor, ColorFormat.HSL);
  });

  const hslOnInput =
    (key: keyof HSL) =>
    ({ currentTarget: { value } }: OnInputEvent) => {
      let floatValue = parseFloat(value);
      if (Number.isNaN(floatValue)) floatValue = 0;
      if (floatValue > hslMaxValuePerKey[key] || floatValue < 0) {
        floatValue = primaryColor.hsl[key];
      }
      colorsStore.updateColors(ColorFormat.HSL, {
        ...primaryColor.hsl,
        [key]: floatValue,
      });
    };
</script>

<div class="colors">
  <ColorSlider
    value={primaryColor.hsl.hue}
    onInput={hslOnInput('hue')}
    maxValue={hslMaxValuePerKey['hue']}
    bgColor={calculateHslBg({
      hue: hueValues,
      steps: 360,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.hsl.saturation}
    onInput={hslOnInput('saturation')}
    maxValue={hslMaxValuePerKey['saturation']}
    bgColor={calculateHslBg({
      saturation: ['0%', '100%'],
      steps: 2,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.hsl.lightness}
    onInput={hslOnInput('lightness')}
    maxValue={hslMaxValuePerKey['lightness']}
    bgColor={calculateHslBg({
      lightness: ['0%', '50%', '100%'],
      steps: 3,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.hsl.alpha}
    onInput={hslOnInput('alpha')}
    maxValue={hslMaxValuePerKey['alpha']}
    step={0.01}
    bgColor={calculateHslBg({
      alpha: [0, 1],
      steps: 2,
      colorFromColorsStore: primaryColor,
    })}
  />
  <div class="hsl-container">
    <input
      class="hsl"
      bind:value={colorString}
      oninput={({ currentTarget: { value: rawValue } }) => {
        const value = rawValue
          .replace('hsla(', '')
          .replace('hsl(', '')
          .replace(')', '');
        const hslValue = parseHslaStringToHsla(value);
        const isValid = hslaRegex.test(rawValue) && validateHsl(hslValue);

        const valueToUpdate = isValid ? hslValue : primaryColor.hsl;
        colorsStore.updateColors(ColorFormat.HSL, valueToUpdate);
      }}
    />
    <CopyToClipboard valueToCopy={colorString} />
  </div>
</div>

<style>
  .colors {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    width: 100%;
  }

  .hsl-container {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    padding-right: 0.25rem;
  }

  .hsl {
    background-color: white;
    text-align: center;
    width: 100%;
    height: 1.5rem;
    border-radius: 4px;
  }
</style>
