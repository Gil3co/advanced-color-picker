import { writable } from 'svelte/store';
import type { Color, Hex, HSL } from '$lib/types';
import { colorToString, getColorUpdate, hslToRgb } from '$lib/helpers';
import { ColorFormat } from '$lib/consts';

const createRandomNumber = ({
  high,
  low = 0,
}: {
  high: number;
  low?: number;
}): number => {
  return Math.floor(Math.random() * (high - low)) + low;
};

export const initialColor: Color = ((): Color => {
  const hsl: HSL = {
    hue: createRandomNumber({ high: 240 }),
    saturation: createRandomNumber({ high: 100 }),
    lightness: createRandomNumber({ high: 100 }),
    alpha: 1,
  };

  return {
    hsl,
    hex: colorToString({ hsl } as Color, ColorFormat.Hex) as Hex,
    rgb: hslToRgb(hsl),
  };
})();

const createStore = (color: Color) => {
  const { set, update, subscribe } = writable<{ primaryColor: Color }>({
    primaryColor: color,
  });

  const updateColors = <Format extends keyof Color>(
    format: ColorFormat,
    colorUpdate: Color[Format],
  ): void => {
    const finalUpdate = getColorUpdate({ from: format, color: colorUpdate });
    update((prev) => {
      return {
        ...prev,
        primaryColor: {
          ...finalUpdate,
        },
      };
    });
  };

  return { set, updateColors, subscribe };
};

export const colorsStore = createStore(initialColor);
