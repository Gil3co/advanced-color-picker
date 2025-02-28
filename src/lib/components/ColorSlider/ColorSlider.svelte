<script lang="ts">
  import { ColorFormat } from '$lib/consts';
  import { colorToString, getOptimalTextColor } from '$lib/helpers';
  import { colorsStore, initialColor } from '$lib/stores';
  import type { Color, OnInputEvent } from '$lib/types';

  type Props = {
    value: number;
    onInput: (event: OnInputEvent) => void;
    maxValue: number;
    bgColor: string;
    step?: number;
  };

  let { value, onInput, maxValue, bgColor, step = 1 }: Props = $props();

  let primaryColor = $state<Color>(initialColor);

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
  });
</script>

<div class="color">
  <input
    type="range"
    data-model="hsl"
    min={0}
    max={maxValue}
    {step}
    {value}
    style:--bg-color={bgColor}
    oninput={onInput}
  />
  <input
    {value}
    type="number"
    oninput={onInput}
    {step}
    min={0}
    max={maxValue}
    style:--bg-color={colorToString(primaryColor, ColorFormat.Hex)}
    style:--font-color={getOptimalTextColor(
      colorToString(primaryColor, ColorFormat.Hex),
    )}
  />
</div>

<style>
  .color {
    display: flex;
    column-gap: 0.25rem;
  }
  input[type='range'] {
    background: var(--bg-color);
    -webkit-appearance: none;
    appearance: none;
    height: 1.25rem;
    width: 100%;
    border-radius: 15px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #ccc;
    cursor: pointer;
  }

  input[type='range']:focus {
    outline: none;
  }

  input[type='number'] {
    width: 2.25rem;
    padding: 0.25rem;
    text-align: center;
    border-radius: 8px;
    background-color: var(--bg-color);
    color: var(--font-color);
    border: none;
  }

  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
</style>
