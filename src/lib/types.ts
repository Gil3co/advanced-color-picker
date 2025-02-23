export type HSL = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
};

export type Color = {
  hsl: HSL;
};

export type OnInputEvent = Event & {
  currentTarget: EventTarget & HTMLInputElement;
};
