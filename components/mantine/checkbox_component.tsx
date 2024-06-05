"use client";

import React from "react";
import { Checkbox, CheckboxProps } from "@mantine/core";

/** Props list of Mantine's Checkbox component - https://mantine.dev/core/checkbox/?t=props */
export interface CheckboxComponentProps extends CheckboxProps {
	onChecked: (val: boolean) => void;
}

/** This is the Mantine Checkbox component - https://mantine.dev/core/checkbox/ */
export const CheckboxComponent = (props: CheckboxComponentProps) =>
	<Checkbox
		{...props}
		onChange={(e) => props.onChecked(e.target.checked)}
	>
		{props.children}
	</Checkbox>;
