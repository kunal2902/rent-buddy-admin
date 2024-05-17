"use client";

import { NumberInput, NumberInputProps } from "@mantine/core";
import React from "react";
import { appColorRGBA, mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's NumberInput component - https://mantine.dev/core/number-input/?t=props */
export interface NumberInputComponentProps extends NumberInputProps {

}

/** This is the Mantine NumberInput component - https://mantine.dev/core/number-input/ */
export const NumberInputComponent = (props: NumberInputComponentProps) =>
	<NumberInput
		{...props}
		size={props.size ?? mantineSize}
		color={props.color ?? appColorRGBA}
		radius={props.radius ?? mantineRadius}
		variant={props.variant ?? mantineInputVariant}
	/>;
