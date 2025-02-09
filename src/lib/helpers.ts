import type { Color } from "./types";

export enum Format {
    HSL = "HSL"
}

export const colorToString = (color: Color, format: Format): string => {
    switch (format) {
        case Format.HSL:
            const { hue,
                saturation, lightness
            } = color.hsl
            return `hsl(${hue},${saturation}%,${lightness}%)`


        default:
            return '';
    }
}