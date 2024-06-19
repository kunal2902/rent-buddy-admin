"use client";

import { createTheme, Input, MantineColorsTuple } from "@mantine/core";
import { getSurfaceColor } from "@/utils";

export const appColor: MantineColorsTuple = [
	"#f2f0ff",
	"#e1def4",
	"#c1bce0",
	"#9f97cd",
	"#8177bd",
	"#6f64b3",
	"#665ab0",
	"#554a9b",
	"#4b418c",
	"#3f387d",
];

export const mainTheme = createTheme({
	colors: {
		"app-color": appColor,
	},
	primaryColor: "app-color",
});

export const coloredInputTheme = (darkMode: boolean) => createTheme({
	components: {
		Input: Input.extend({
			// @ts-ignore
			vars: () => ({ input: { backgroundColor: getSurfaceColor(darkMode).backgroundColor } }),
		}),
	},
});

export const centeredInputTheme = createTheme({
	components: {
		Input: Input.extend({
			// @ts-ignore
			vars: () => ({ input: { "--input-text-align": "center" } }),
		}),
	},
});
