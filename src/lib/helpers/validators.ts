import { hslMaxValuePerKey } from '$lib/consts';
import type { RGB, HSL } from '$lib/types';

interface IValidateBetweenRange {
  min: number;
  max: number;
  value: number;
}
const validateBetweenRange = ({
  min,
  max,
  value,
}: IValidateBetweenRange): boolean => {
  return min <= value && value <= max;
};

const minColor = 0;

export const validateRgb = ({ red, green, blue, alpha }: RGB): boolean => {
  const maxColor = 255;
  const maxAlpha = 1;
  return (
    validateBetweenRange({ min: minColor, max: maxColor, value: red }) &&
    validateBetweenRange({ min: minColor, max: maxColor, value: green }) &&
    validateBetweenRange({ min: minColor, max: maxColor, value: blue }) &&
    validateBetweenRange({ min: minColor, max: maxAlpha, value: alpha })
  );
};

export const validateHsl = ({
  hue,
  saturation,
  lightness,
  alpha,
}: HSL): boolean => {
  return (
    validateBetweenRange({
      min: minColor,
      max: hslMaxValuePerKey['hue'],
      value: hue,
    }) &&
    validateBetweenRange({
      min: minColor,
      max: hslMaxValuePerKey['saturation'],
      value: saturation,
    }) &&
    validateBetweenRange({
      min: minColor,
      max: hslMaxValuePerKey['lightness'],
      value: lightness,
    }) &&
    validateBetweenRange({
      min: minColor,
      max: hslMaxValuePerKey['alpha'],
      value: alpha,
    })
  );
};
