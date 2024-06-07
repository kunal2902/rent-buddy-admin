"use client";

import React from "react";
import { Popover, PopoverProps } from "@mantine/core";
import { mantineRadius } from "@/utils";

/** Props list of Mantine's Popover component - https://mantine.dev/core/popover/?t=props */
export interface PopoverComponentProps extends PopoverProps {

}

/** This is the Mantine Popover component - https://mantine.dev/core/popover/ */
export const PopoverComponent = (props: PopoverComponentProps) =>
	<Popover
		withArrow
		offset={0}
		shadow="md"
		width={250}
		arrowPosition="center"
		radius={mantineRadius}
		{...props}
	>
		{props.children}
	</Popover>;

export const PopoverTargetComponent = Popover.Target;
export const PopoverDropdownComponent = Popover.Dropdown;
