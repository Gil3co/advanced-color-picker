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

  const trackBg = ({
    type = '',
    steps = 0,
    props = [],
    // alpha = 'var(--picker-alpha)',
  }) => {
    const grad = [];
    const propVal = (prop, i) => (typeof prop === 'function' ? prop(i) : prop);
    for (let i = 0; i < steps; i += 1) {
      const vals = props.map((val) => propVal(val, i)).join(' ');
      // if (alpha) {
      //   grad.push(`${type}(${vals} / ${propVal(alpha, i)})`);
      // } else {
      grad.push(`${type}(${vals})`);
      // }
    }
    return `linear-gradient(to right, ${grad.join(', ')})`;
  };
  const hslBg = ({
    hue = 'var(--picker-hue)',
    sat = 'calc(var(--picker-saturation) * 1%)',
    lig = 'calc(var(--picker-luminosity) * 1%)',
    ...props
  }) => trackBg({ type: 'hsl', props: [hue, sat, lig], ...props });
</script>

<h1>Advanced Color Palette</h1>
<ColorChip color={colorToString(primaryColor, Format.HSL)} />
<div>
  <input
    type="range"
    data-model="hsl"
    name="hue"
    min={0}
    max={360}
    step={1}
    value={primaryColor.hsl.hue}
    style:--bg-color={hslBg({
      hue: (v) => v,
      steps: 360,
      sat: `${primaryColor.hsl.saturation}%`,
      lig: `${primaryColor.hsl.lightness}%`,
    })}
    on:input={({ target: { value } }) => {
      colorsStore.set({
        primaryColor: { hsl: { ...primaryColor.hsl, hue: parseInt(value) } },
      });
    }}
  />
  <input
    type="range"
    data-model="saturation"
    name="saturation"
    min={0}
    max={100}
    step={1}
    value={primaryColor.hsl.saturation}
    style:--bg-color={hslBg({
      hue: (v) => v,
      steps: 100,
      sat: (s) => (s ? '100%' : '0%'),
      steps: 2,
      lig: `${primaryColor.hsl.lightness}%`,
    })}
    on:input={({ target: { value } }) => {
      colorsStore.set({
        primaryColor: {
          hsl: { ...primaryColor.hsl, saturation: parseInt(value) },
        },
      });
    }}
  />
</div>

<style>
  input {
    background: var(--bg-color);
    -webkit-appearance: none;
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
</style>
