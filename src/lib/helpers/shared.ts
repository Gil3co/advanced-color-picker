import type { RGB } from '$lib/types';

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
