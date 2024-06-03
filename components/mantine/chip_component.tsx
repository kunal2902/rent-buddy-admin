"use client";

import React from "react";
import { Chip, ChipProps } from "@mantine/core";
import { appColorRGBA, mantineChipSize, mantineRadius } from "@/utils";

/** Props list of Mantine's Chip component - https://mantine.dev/core/chip/?t=props */
export interface ChipComponentProps extends ChipProps {

}

/** This is the Mantine Chip component - https://mantine.dev/chip/group/ */
export const ChipComponent = (props: ChipComponentProps) =>
	<Chip
		{...props}
		size={props.size ?? mantineChipSize}
		color={props.color ?? appColorRGBA}
		radius={props.radius ?? mantineRadius}
	>
		{props.children}
	</Chip>;
