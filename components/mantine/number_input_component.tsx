"use client";

import { NumberInput, NumberInputProps } from "@mantine/core";
import React from "react";
import { appColorRGBA, mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's NumberInput component - https://mantine.dev/core/number-input/?t=props */
export interface NumberInputComponentProps extends NumberInputProps {
	setValue: (value: string | number) => void;
}

/** This is the Mantine NumberInput component - https://mantine.dev/core/number-input/ */
export const NumberInputComponent = (props: NumberInputComponentProps) => {
	const {
		setValue,
		...rest
	} = props;

	const handleChange = (value: string | number) => {
		setValue(value);
	};

	return (
		<NumberInput
			onChange={handleChange}
			{...rest}
			size={rest.size ?? mantineSize}
			color={rest.color ?? appColorRGBA}
			radius={rest.radius ?? mantineRadius}
			variant={rest.variant ?? mantineInputVariant}
		/>
	);
};
