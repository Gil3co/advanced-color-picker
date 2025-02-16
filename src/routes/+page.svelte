<script lang="ts">
  import {
    ColorChip,
    colorsStore,
    initialColor,
    colorToString,
    Format,
  } from '$lib';
  import type { Color } from '$lib/types';

  let primaryColor = $state<Color>(initialColor);

  colorsStore.subscribe((storeValue) => {
    primaryColor = storeValue.primaryColor;
  });

  const calculateInputBg = ({
    type = '',
    steps = 0,
    props = [],
    alpha = 100,
  }) => {
    const grad = [];
    const propVal = (prop, i) => (typeof prop === 'function' ? prop(i) : prop);
    for (let i = 0; i < steps; i += 1) {
      const colorVals = props.map((val) => propVal(val, i)).join(' ');
      if (alpha) {
        grad.push(`${type}(${colorVals} / ${propVal(alpha, i)})`);
      } else {
        grad.push(`${type}(${colorVals})`);
      }
    }
    return `linear-gradient(to right, ${grad.join(', ')})`;
  };
  const calculateHslBg = ({
    hue = primaryColor.hsl.hue,
    sat = `calc(${primaryColor.hsl.saturation} * 1%)`,
    lig = `calc(${primaryColor.hsl.lightness} * 1%)`,
    ...props
  }) => calculateInputBg({ type: 'hsl', props: [hue, sat, lig], ...props });
</script>

<h1>Advanced Color Palette</h1>
<ColorChip color={colorToString(primaryColor, Format.HSL)} />
<p>
  {colorToString(primaryColor, Format.Hex)}
</p>
<div class="colors">
  <div class="color">
    <input
      type="range"
      data-model="hsl"
      name="hue"
      min={0}
      max={360}
      step={1}
      value={primaryColor.hsl.hue}
      style:--bg-color={calculateHslBg({
        hue: (v) => v,
        steps: 360,
      })}
      oninput={({ currentTarget: { value } }) => {
        colorsStore.set({
          primaryColor: { hsl: { ...primaryColor.hsl, hue: parseInt(value) } },
        });
      }}
    />
    <input
      value={primaryColor.hsl.hue}
      type="number"
      oninput={({ currentTarget: { value } }) => {
        colorsStore.set({
          primaryColor: { hsl: { ...primaryColor.hsl, hue: parseInt(value) } },
        });
      }}
    />
  </div>
  <div class="color">
    <input
      type="range"
      data-model="hsl"
      name="saturation"
      min={0}
      max={100}
      step={1}
      value={primaryColor.hsl.saturation}
      style:--bg-color={calculateHslBg({
        steps: 2,
        sat: (s) => (s ? '100%' : '0%'),
      })}
      oninput={({ currentTarget: { value } }) => {
        colorsStore.set({
          primaryColor: {
            hsl: { ...primaryColor.hsl, saturation: parseInt(value) },
          },
        });
      }}
    />
    <input
      value={primaryColor.hsl.saturation}
      type="number"
      oninput={({ currentTarget: { value } }) => {
        colorsStore.set({
          primaryColor: {
            hsl: { ...primaryColor.hsl, saturation: parseInt(value) },
          },
        });
      }}
    />
  </div>
  <div class="color">
    <input
      type="range"
      data-model="hsl"
      name="lightness"
      min={0}
      max={100}
      step={1}
      value={primaryColor.hsl.lightness}
      style:--bg-color={calculateHslBg({
        steps: 3,
        lig: (l) => `${l * 50}%`,
      })}
      oninput={({ currentTarget: { value } }) => {
        colorsStore.set({
          primaryColor: {
            hsl: { ...primaryColor.hsl, lightness: parseInt(value) },
          },
        });
      }}
    />
    <input
      value={primaryColor.hsl.lightness}
      type="number"
      oninput={({ currentTarget: { value } }) => {
        colorsStore.set({
          primaryColor: {
            hsl: { ...primaryColor.hsl, lightness: parseInt(value) },
          },
        });
      }}
    />
  </div>
</div>

<style>
  .colors {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }

  .color {
    display: flex;
    column-gap: 0.25rem;
  }
  input[type='range'] {
    background: var(--bg-color);
    -webkit-appearance: none;
    appearance: none;
    height: 1.25rem;
    width: 50rem;
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
    width: 2rem;
    text-align: center;
    border-radius: 8px;
    background-color: lightgray;
    border: none;
  }

  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
</style>
