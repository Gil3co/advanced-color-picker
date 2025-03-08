import type { HSL, RGB } from '$lib/types';

export const hexToRgb = (hex: string): RGB => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  const alpha = hex.length > 6 ? parseInt(hex.substring(6, 8), 16) : 1;

  return { red, green, blue, alpha };
};

export const hslToRgb = ({ hue, saturation, lightness, alpha }: HSL): RGB => {
  lightness /= 100;
  const chroma = (saturation * Math.min(lightness, 1 - lightness)) / 100;

  const calculateColorComponent = (n: number): number => {
    const intermediateHue = (n + hue / 30) % 12;
    const color =
      lightness -
      chroma *
        Math.max(Math.min(intermediateHue - 3, 9 - intermediateHue, 1), -1);
    return Math.round(color * 255);
  };

  return {
    red: calculateColorComponent(0),
    green: calculateColorComponent(8),
    blue: calculateColorComponent(4),
    alpha,
  };
};
