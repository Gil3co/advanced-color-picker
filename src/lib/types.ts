export type HSL = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
};

export type RGB = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export type Hex = `#${string}`;

export type Color = {
  hsl: HSL;
  hex: Hex;
  rgb: RGB;
};

export type OnInputEvent = Event & {
  currentTarget: EventTarget & HTMLInputElement;
};
