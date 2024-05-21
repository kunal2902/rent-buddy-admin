"use client";

import {
	Select, SelectProps,
} from "@mantine/core";
import React from "react";
import { mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's Select component - https://mantine.dev/core/select/?t=props */
export interface SelectComponentProps extends SelectProps {

}

/** This is the Mantine Select component - https://mantine.dev/core/select/ */
export const SelectComponent = (props: SelectComponentProps) =>
	<Select
		{...props}
		size={props.size ?? mantineSize}
		radius={props.radius ?? mantineRadius}
		variant={props.variant ?? mantineInputVariant}
		allowDeselect={props.allowDeselect ?? false}
	>
		{props.children}
	</Select>;
