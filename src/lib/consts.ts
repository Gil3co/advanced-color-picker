export const hueValues = Array.from({ length: 360 }, (_, i) => i); // array of 0 to 359

export const rgbValues = Array.from({ length: 256 }, (_, i) => i); // array of 0 to 255

export enum ColorFormat {
  HSL = 'hsl',
  Hex = 'hex',
  RGB = 'rgb',
}

export const colorFormats = new Set(
  Object.keys(ColorFormat),
) as Set<ColorFormat>;

export const hexRegex = /#[0-9a-f]{6}/;
