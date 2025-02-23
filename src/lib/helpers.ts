import type { Color, HSL } from './types';

export enum ColorFormat {
  HSL = 'hsl',
  Hex = 'hex',
}

const hexToRgba = (hex: string): [number, number, number, number] => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

  return [r, g, b, a];
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

const hslToHex = ({ hue, saturation, lightness, alpha }: HSL): string => {
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
