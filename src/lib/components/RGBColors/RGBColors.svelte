<script lang="ts">
  import { ColorFormat, rgbValues } from '$lib/consts';
  import {
    calculateRgbBg,
    colorToString,
    parseRgbaStringToRgba,
    validateRgb,
  } from '$lib/helpers';
  import { colorsStore, initialColor } from '$lib/stores';
  import type { Color, OnInputEvent, RGB } from '$lib/types';
  import { ColorSlider } from '../ColorSlider';
  import { CopyToClipboard } from '../CopyToClipboard';

  const rgbaRegex =
    /^rgba\(\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(\s*\/\s*(0?\.?\d+|1(\.0)?))?\s*\)$/;

  let primaryColor = $state<Color>(initialColor);
  let colorString = $state(colorToString(initialColor, ColorFormat.RGB));
  const maxValue = 255;
  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
    colorString = colorToString(storeValue.primaryColor, ColorFormat.RGB);
  });

  const rgbOnInput =
    (key: keyof RGB) =>
    ({ currentTarget: { value } }: OnInputEvent) => {
      let floatValue = parseFloat(value);
      if (Number.isNaN(floatValue)) floatValue = 0;
      if (floatValue > maxValue || floatValue < 0) {
        floatValue = primaryColor.rgb[key];
      }
      colorsStore.updateColors(ColorFormat.RGB, {
        ...primaryColor.rgb,
        [key]: floatValue,
      });
    };
</script>

<div class="colors">
  <ColorSlider
    value={primaryColor.rgb.red}
    onInput={rgbOnInput('red')}
    {maxValue}
    bgColor={calculateRgbBg({
      red: rgbValues,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.rgb.green}
    onInput={rgbOnInput('green')}
    {maxValue}
    bgColor={calculateRgbBg({
      green: rgbValues,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.rgb.blue}
    onInput={rgbOnInput('blue')}
    {maxValue}
    bgColor={calculateRgbBg({
      blue: rgbValues,
      colorFromColorsStore: primaryColor,
    })}
  />
  <ColorSlider
    value={primaryColor.rgb.alpha}
    onInput={rgbOnInput('alpha')}
    maxValue={1}
    step={0.01}
    bgColor={calculateRgbBg({
      alpha: [0, 1],
      steps: 2,
      colorFromColorsStore: primaryColor,
    })}
  />
  <div class="rgb-container">
    <input
      class="rgb"
      bind:value={colorString}
      type="text"
      oninput={({ currentTarget: { value: rawValue } }) => {
        const value = rawValue.replace('rgba(', '').replace(')', '');
        const rgbValue = parseRgbaStringToRgba(value);
        const isValid = rgbaRegex.test(rawValue) && validateRgb(rgbValue);

        const valueToUpdate = isValid ? rgbValue : primaryColor.rgb;
        colorsStore.updateColors(ColorFormat.RGB, valueToUpdate);
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

  .rgb-container {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    padding-right: 0.25rem;
  }

  .rgb {
    background-color: #e5e5e6;
    text-align: center;
    width: 100%;
    height: 1.5rem;
    border-radius: 4px;
  }
</style>
