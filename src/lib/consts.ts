export const hueValues = Array.from({ length: 360 }, (_, i) => i); // array of 0 to 260

export enum ColorFormat {
  HSL = 'hsl',
  Hex = 'hex',
}

export const colorFormats = new Set(
  Object.keys(ColorFormat),
) as Set<ColorFormat>;

export const hexRegex = /#[0-9a-f]{6}/;
