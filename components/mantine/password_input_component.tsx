"use client";

import { PasswordInput, PasswordInputProps } from "@mantine/core";
import React from "react";
import { appColorRGBA, mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's PasswordInput component - https://mantine.dev/core/password-input/?t=props */
export interface PasswordInputComponentProps extends PasswordInputProps {
	setValue: (value: string) => void;
}

/** This is the Mantine PasswordInput component - https://mantine.dev/core/password-input/ */
export const PasswordInputComponent = (props: PasswordInputComponentProps) => {
	const {
		setValue,
		...rest
	} = props;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	return <PasswordInput
		onChange={handleChange}
		{...rest}
		size={rest.size ?? mantineSize}
		color={rest.color ?? appColorRGBA}
		radius={rest.radius ?? mantineRadius}
		variant={rest.variant ?? mantineInputVariant}
	/>;
};
