"use client";

import {
	ComboboxItem,
	Select, SelectProps,
} from "@mantine/core";
import React from "react";
import { mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's Select component - https://mantine.dev/core/select/?t=props */
export interface SelectComponentProps extends SelectProps {
	setOption?: (option: ComboboxItem) => void;
	setValue: (val: string | null) => void;
}

/** This is the Mantine Select component - https://mantine.dev/core/select/ */
export const SelectComponent = (props: SelectComponentProps) => {
	const { setOption, setValue, ...rest } = props;
	const handleChange = (value: string | null, option: ComboboxItem) => {
		setValue(value);
		if (setOption) {
			setOption(option);
		}
	};

	return (
		<Select
			onChange={handleChange}
			{...rest}
			size={rest.size ?? mantineSize}
			radius={rest.radius ?? mantineRadius}
			variant={rest.variant ?? mantineInputVariant}
			allowDeselect={rest.allowDeselect ?? false}
	>
			{rest.children}
		</Select>
	);
};
