"use client";

import React from "react";
import {
	Chip, ChipProps,
} from "@mantine/core";

/** Props list of Mantine's Chip component - https://mantine.dev/core/chip/?t=props */
export interface ChipComponentProps extends ChipProps {

}

/** This is the Mantine Chip component - https://mantine.dev/chip/group/ */
export const ChipComponent = (props: ChipComponentProps) =>
	<Chip
		{...props}
	>
		{props.children}
	</Chip>;
