"use client";

import { PasswordInput, PasswordInputProps } from "@mantine/core";
import React from "react";
import { appColorRGBA, mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's PasswordInput component - https://mantine.dev/core/password-input/?t=props */
export interface PasswordInputComponentProps extends PasswordInputProps {

}

/** This is the Mantine PasswordInput component - https://mantine.dev/core/password-input/ */
export const PasswordInputComponent = (props: PasswordInputComponentProps) =>
	<PasswordInput
		{...props}
		size={props.size ?? mantineSize}
		color={props.color ?? appColorRGBA}
		radius={props.radius ?? mantineRadius}
		variant={props.variant ?? mantineInputVariant}
	/>;
