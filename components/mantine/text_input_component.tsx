import { TextInput, TextInputProps } from "@mantine/core";
import React from "react";
import {
	appColorRGBA,
	mantineInputVariant,
	mantineRadius,
	mantineSize,
} from "@/utils";

/** Props list of Mantine's TextInput component - https://mantine.dev/core/text-input/?t=props */
export interface TextInputComponentProps extends TextInputProps {}

/** This is the Mantine TextInput component - https://mantine.dev/core/text-input/ */
export const TextInputComponent = (props: TextInputComponentProps) => (
	<TextInput
		size={props.size ?? mantineSize}
		color={props.color ?? appColorRGBA}
		radius={props.radius ?? mantineRadius}
		variant={props.variant ?? mantineInputVariant}
		{...props}
	/>
);
