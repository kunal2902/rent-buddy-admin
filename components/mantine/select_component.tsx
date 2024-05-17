"use client";

import {
	Select, SelectProps,
} from "@mantine/core";
import React from "react";
import { appColorRGBA, mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's Select component - https://mantine.dev/core/select/?t=props */
export interface SelectComponentProps extends SelectProps {

}

/** This is the Mantine Select component - https://mantine.dev/core/select/ */
export const SelectComponent = (props: SelectComponentProps) =>
	<Select
		{...props}
		size={mantineSize}
		color={appColorRGBA}
		radius={mantineRadius}
		variant={mantineInputVariant}
		allowDeselect={props.allowDeselect ?? false}
	>
		{props.children}
	</Select>;
