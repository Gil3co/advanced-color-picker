export * from './background';
export * from './contrast';
export * from './validators';

import { ColorFormat } from '../consts';
import type { Color, Hex, HSL, RGB } from '../types';
import { hexToRgb } from './shared';

const prepareRgbForHsl = ({ red, green, blue, alpha }: RGB): RGB => {
  return {
    red: red / 255,
    green: green / 255,
    blue: blue / 255,
    alpha,
  };
};

export const rgbToHsla = (rgb: RGB): HSL => {
  const { red, green, blue, alpha } = prepareRgbForHsl(rgb);

  // Calculate HSL
  const max = Math.max(red, green, blue),
    min = Math.min(red, green, blue);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const diff = max - min;
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    switch (max) {
      case red:
        h = (green - blue) / diff + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / diff + 2;
        break;
      case blue:
        h = (red - green) / diff + 4;
        break;
    }
    h *= 60;
  }

  return {
    hue: Math.round(h),
    saturation: Math.round(s * 100),
    lightness: Math.round(l * 100),
    alpha: parseFloat(alpha.toFixed(2)),
  };
};

export const hexToHsla = (hex: string): HSL => {
  const rgb = hexToRgb(hex);
  return rgbToHsla(rgb);
};

const rgbNumToHexAndPad = (num: number): string =>
  num.toString(16).padStart(2, '0');

const rgbToHex = ({ red, green, blue, alpha }: RGB): Hex => {
  const alphaHex =
    alpha !== 1 ? rgbNumToHexAndPad(Math.round(alpha * 255)) : '';
  return `#${rgbNumToHexAndPad(red)}${rgbNumToHexAndPad(green)}${rgbNumToHexAndPad(blue)}${alphaHex}`;
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

const hslToHex = (hsl: HSL): Hex => {
  const rgb = hslToRgb(hsl);
  return rgbToHex(rgb);
};

export const colorToString = (
  { hsl, rgb }: Color,
  format: ColorFormat,
): string => {
  switch (format) {
    case ColorFormat.HSL: {
      const { hue, saturation, lightness, alpha } = hsl;
      return `hsla(${hue} ${saturation}% ${lightness}%${alpha !== 1 ? ` / ${alpha}` : ''})`;
    }
    case ColorFormat.Hex:
      return hslToHex(hsl);
    case ColorFormat.RGB: {
      const { red, green, blue, alpha } = rgb;
      return `rgba(${red} ${green} ${blue}${alpha !== 1 ? ` / ${alpha}` : ''})`;
    }
    default:
      return '';
  }
};

export const parseHslaStringToHsla = (hslaString: string): HSL => {
  const [hsl, a] = hslaString.split(' / ');
  const [h, s, l] = hsl.split(' ');
  const alpha = a ? parseFloat(a) : 1;
  const hue = parseFloat(h);
  const saturation = parseFloat(s.replace('%', ''));
  const lightness = parseFloat(l.replace('%', ''));
  return { alpha, hue, saturation, lightness };
};

export const parseRgbaStringToRgba = (rbgaString: string): RGB => {
  const [rgb, a] = rbgaString.split(' / ');
  const [red, green, blue] = rgb.split(' ').map((color) => parseFloat(color));
  const alpha = a ? parseFloat(a) : 1;
  return { alpha, red, green, blue };
};

export type TTranslateColors<Format extends keyof Color> = {
  from: ColorFormat;
  color: Color[Format];
};

export const getColorUpdate = <Format extends keyof Color>({
  from,
  color,
}: TTranslateColors<Format>): Color => {
  switch (from) {
    case ColorFormat.HSL: {
      const hsl = color as HSL;
      return {
        hsl,
        hex: hslToHex(hsl),
        rgb: hslToRgb(hsl),
      };
    }
    case ColorFormat.Hex: {
      const hex = color as Hex;
      return {
        hex,
        hsl: hexToHsla(hex),
        rgb: hexToRgb(hex),
      };
    }
    case ColorFormat.RGB: {
      const rgb = color as RGB;
      return {
        rgb,
        hsl: rgbToHsla(rgb),
        hex: rgbToHex(rgb),
      };
    }
  }
};
