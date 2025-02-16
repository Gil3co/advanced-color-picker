import type { Color, HSL } from './types';

export enum Format {
  HSL = 'HSL',
  Hex = 'hex',
}

const hslToHex = ({ hue, saturation, lightness }: HSL): string => {
  lightness /= 100;
  const chroma = (saturation * Math.min(lightness, 1 - lightness)) / 100;

  const calculateColorCOmponent = (n: number): string => {
    const intermediateHug = (n + hue / 30) % 12;
    const color =
      lightness -
      chroma *
        Math.max(Math.min(intermediateHug - 3, 9 - intermediateHug, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${calculateColorCOmponent(0)}${calculateColorCOmponent(8)}${calculateColorCOmponent(4)}`;
};

export const colorToString = (color: Color, format: Format): string => {
  const { hue, saturation, lightness } = color.hsl;
  switch (format) {
    case Format.HSL:
      return `hsl(${hue},${saturation}%,${lightness}%)`;
    case Format.Hex:
      return hslToHex(color.hsl);
    default:
      return '';
  }
};
