import { writable } from "svelte/store";
import type { Color } from "$lib/types";

const createRandomNumber = ({
	high,
	low = 0,
}: { high: number; low?: number }) => {
	return Math.floor(Math.random() * (high - low)) + low;
};

export const initialColor: Color = {
	hsl: {
		hue: createRandomNumber({ high: 240 }),
		saturation: createRandomNumber({ high: 100 }),
		lightness: createRandomNumber({ high: 100 }),
	},
};

const createStore = (color: Color) => {
	const { set, update, subscribe } = writable<{ primaryColor: Color }>({
		primaryColor: color,
	});

	return { set, update, subscribe };
};

export const colorsStore = createStore(initialColor);
