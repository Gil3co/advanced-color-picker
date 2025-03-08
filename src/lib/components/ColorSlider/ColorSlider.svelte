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
    style:--red={primaryColor.rgb.red}
    style:--green={primaryColor.rgb.green}
    style:--blue={primaryColor.rgb.red}
    oninput={onInput}
  />
  <input
    bind:value
    type="number"
    oninput={onInput}
    {step}
    min={0}
    max={maxValue}
    style:--bg-color={colorToString(primaryColor, ColorFormat.HSL)}
    style:--font-color={getOptimalTextColor(primaryColor.hsl)}
  />
</div>

<style>
  .color {
    display: flex;
    column-gap: 0.25rem;
  }
  input[type='range'] {
    background: var(--bg-color);
    appearance: none;
    height: 1.25rem;
    width: 100%;
    border-radius: 15px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    box-shadow:
      0 0 0 3px rgba(var(--red), var(--green), var(--blue), 0.3) inset,
      0 0 0 3px rgba(255, 255, 255, 1) inset,
      0 0 0 4px rgb(0 0 0 / 0.5) inset,
      0 0 0 1px rgb(0 0 0 / 0.5);
    cursor: ew-resize;
    transition: box-shadow 0.2s;
  }
  input[type='range']:hover::-webkit-slider-thumb {
    box-shadow:
      0 0 0 3px rgba(var(--red), var(--green), var(--blue), 0.1) inset,
      0 0 0 3px rgba(255, 255, 255, 1) inset,
      0 0 0 4px rgb(0 0 0 / 0.5) inset,
      0 0 0 1px rgb(0 0 0 / 0.5);
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
