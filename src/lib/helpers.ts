import type { Color } from './types';

export enum Format {
  HSL = 'HSL',
}

export const colorToString = (color: Color, format: Format): string => {
  const { hue, saturation, lightness } = color.hsl;
  switch (format) {
    case Format.HSL:
      return `hsl(${hue},${saturation}%,${lightness}%)`;

    default:
      return '';
  }
};
