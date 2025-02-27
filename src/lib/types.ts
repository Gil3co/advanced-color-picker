export type HSL = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
};

export type Hex = `#${string}`;

export type Color = {
  hsl: HSL;
  hex: Hex;
};

export type OnInputEvent = Event & {
  currentTarget: EventTarget & HTMLInputElement;
};
