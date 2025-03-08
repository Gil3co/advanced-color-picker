import { ColorFormat } from '$lib/consts';
import type { Color } from '$lib/types';

type ColorValue = string | number;

type ColorProp = ColorValue | ColorValue[];

const calculateVal = (colorProp: ColorProp, index: number): ColorValue => {
  if (Array.isArray(colorProp)) return colorProp[index];
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
    grad.push(`${type}(${colorVals} / ${calculateVal(alpha, i)})`);
  }
  return `linear-gradient(to right, ${grad.join(', ')})`;
};

interface ICalculateBackgroundColor {
  alpha?: ColorProp;
  colorFromColorsStore: Color;
  steps?: number;
}

type TCalculateHslBackground = ICalculateBackgroundColor & {
  hue?: ColorProp;
  saturation?: ColorProp;
  lightness?: ColorProp;
};

export const calculateHslBg = ({
  hue,
  saturation,
  lightness,
  alpha,
  steps = 0,
  colorFromColorsStore,
}: TCalculateHslBackground): string => {
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

type TCalculateRgbBackground = ICalculateBackgroundColor & {
  red?: ColorProp;
  green?: ColorProp;
  blue?: ColorProp;
};

export const calculateRgbBg = ({
  red,
  green,
  blue,
  alpha,
  steps = 256,
  colorFromColorsStore: { rgb },
}: TCalculateRgbBackground): string => {
  const redProp = red ?? rgb.red;
  const blueProp = blue ?? rgb.blue;
  const greenProp = green ?? rgb.green;
  const alphaProp = alpha ?? rgb.alpha;
  return calculateInputBg({
    type: ColorFormat.RGB,
    steps,
    props: [redProp, greenProp, blueProp],
    alpha: alphaProp,
  });
};
