import { ColorFormat } from './consts';
import type { Color, Hex, HSL } from './types';

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');

  // Expand short HEX (#RGBA → #RRGGBBAA)
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
};

const hexToRgba = (hex: string): [number, number, number, number] => {
  const [r, g, b] = hexToRgb(hex);
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

  return [r, g, b, a];
};

export const hexToHsla = (hex: string): HSL => {
  const [r, g, b] = hexToRgb(hex).map((color) => color / 255);
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1; // Alpha (default 1 if not provided)

  // Calculate HSL
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const diff = max - min;
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h *= 60;
  }

  return {
    hue: Math.round(h),
    saturation: Math.round(s * 100),
    lightness: Math.round(l * 100),
    alpha: parseFloat(a.toFixed(2)),
  };
};

const blendWithWhite = ([r, g, b, a]: [number, number, number, number]): [
  number,
  number,
  number,
] => [
  Math.round((1 - a) * 255 + a * r),
  Math.round((1 - a) * 255 + a * g),
  Math.round((1 - a) * 255 + a * b),
];

const getRelativeLuminance = ([r, g, b]: [number, number, number]): number => {
  const sRGB = [r, g, b].map((value) => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
};

const getContrastRatio = (hex1: string, hex2: string): number => {
  const rgb1 = blendWithWhite(hexToRgba(hex1));
  const rgb2 = blendWithWhite(hexToRgba(hex2));

  const luminance1 = getRelativeLuminance(rgb1);
  const luminance2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const getOptimalTextColor = (backgroundColor: string): string =>
  getContrastRatio(backgroundColor, '#000000') >= 4.5 ? '#000000' : '#ffffff';

const roundAndPadHex = (num: number): string =>
  Math.round(255 * num)
    .toString(16)
    .padStart(2, '0');

const hslToHex = ({ hue, saturation, lightness, alpha }: HSL): Hex => {
  lightness /= 100;
  const chroma = (saturation * Math.min(lightness, 1 - lightness)) / 100;

  const calculateColorComponent = (n: number): string => {
    const intermediateHug = (n + hue / 30) % 12;
    const color =
      lightness -
      chroma *
        Math.max(Math.min(intermediateHug - 3, 9 - intermediateHug, 1), -1);
    return roundAndPadHex(color);
  };

  const alphaHex = alpha !== 1 ? roundAndPadHex(alpha) : '';

  return `#${calculateColorComponent(0)}${calculateColorComponent(8)}${calculateColorComponent(4)}${alphaHex}`;
};

export const colorToString = (color: Color, format: ColorFormat): string => {
  const { hue, saturation, lightness, alpha } = color.hsl;
  switch (format) {
    case ColorFormat.HSL:
      return `hsla(${hue} ${saturation}% ${lightness}%${alpha !== 1 ? ` / ${alpha}` : ''})`;
    case ColorFormat.Hex:
      return hslToHex(color.hsl);
    default:
      return '';
  }
};

export const parseHlsaStringToHlsa = (hslaString: string): HSL => {
  const [hsl, a] = hslaString.split(' / ');
  const [h, s, l] = hsl.split(' ');
  const alpha = a ? parseFloat(a) : 1;
  const hue = parseFloat(h);
  const saturation = parseFloat(s.replace('%', ''));
  const lightness = parseFloat(l.replace('%', ''));
  return { alpha, hue, saturation, lightness };
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
      };
    }
    case ColorFormat.Hex: {
      const hex = color as Hex;
      return {
        hex,
        hsl: hexToHsla(hex),
      };
    }
  }
};

type ColorValue = string | number;

type ColorProp =
  // ((value: number) => number)
  ColorValue | ColorValue[];

const calculateVal = (colorProp: ColorProp, index: number): ColorValue => {
  if (Array.isArray(colorProp)) return colorProp[index];
  // if (typeof colorProp === 'function') return colorProp(index);
  return colorProp;
};

const calculateInputBg = ({
  type,
  steps = 0,
  props = [],
  alpha = 100,
}: {
  type: ColorFormat;
  steps: number;
  props: ColorProp[];
  alpha: ColorProp;
}): string => {
  const grad = [];
  for (let i = 0; i < steps; i += 1) {
    const colorVals = props.map((val) => calculateVal(val, i)).join(' ');
    // if (alpha) {
    grad.push(`${type}(${colorVals} / ${calculateVal(alpha, i)})`);
    // } else {
    //   grad.push(`${type}(${colorVals})`);
    // }
  }
  return `linear-gradient(to right, ${grad.join(', ')})`;
};

export const calculateHslBg = ({
  hue,
  saturation,
  lightness,
  alpha,
  steps = 0,
  colorFromColorsStore,
}: {
  hue?: ColorProp;
  saturation?: ColorProp;
  lightness?: ColorProp;
  alpha?: ColorProp;
  steps?: number;
  colorFromColorsStore: Color;
}): string => {
  const { hsl } = colorFromColorsStore;
  const hueProp = hue ?? hsl.hue;
  const saturationProp = saturation ?? `calc(${hsl.saturation} * 1%)`;
  const lightnessProp = lightness ?? `calc(${hsl.lightness} * 1%)`;
  const alphaProp = alpha ?? hsl.alpha;

  return calculateInputBg({
    type: ColorFormat.HSL,
    props: [hueProp, saturationProp, lightnessProp],
    alpha: alphaProp,
    steps,
  });
};
