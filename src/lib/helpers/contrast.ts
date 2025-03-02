import type { HSL, RGB } from '$lib/types';
import { hslToRgb, hexToRgb } from './shared';

const blendWithWhite = ({
  red,
  green,
  blue,
  alpha,
}: RGB): [number, number, number] => {
  return [
    Math.round((1 - alpha) * 255 + alpha * red),
    Math.round((1 - alpha) * 255 + alpha * green),
    Math.round((1 - alpha) * 255 + alpha * blue),
  ];
};

const getRelativeLuminance = ([r, g, b]: [number, number, number]): number => {
  const sRGB = [r, g, b].map((value) => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
};

const getContrastRatio = (hsl: HSL, hex2: string): number => {
  const rgb1 = blendWithWhite(hslToRgb(hsl));
  const rgb2 = blendWithWhite(hexToRgb(hex2));

  const luminance1 = getRelativeLuminance(rgb1);
  const luminance2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const getOptimalTextColor = (backgroundColor: HSL): string =>
  getContrastRatio(backgroundColor, '#000000') >= 4.5
    ? 'var(--dark-gray)'
    : '#ffffff';
