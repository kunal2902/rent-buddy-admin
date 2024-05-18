"use client";

import { createTheme, MantineColorsTuple } from "@mantine/core";

const appColor: MantineColorsTuple = [
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

export const theme = createTheme({
	colors: {
		"app-color": appColor,
	},
	primaryColor: "app-color",
});
