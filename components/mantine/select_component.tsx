"use client";

import {
	ComboboxItem,
	Select, SelectProps,
} from "@mantine/core";
import React from "react";
import { mantineInputVariant, mantineRadius, mantineSize } from "@/utils";
import { ComboBoxProps } from "@/types";

/** Props list of Mantine's Select component - https://mantine.dev/core/select/?t=props */
export interface SelectComponentProps extends SelectProps {
	setOption?: (option: ComboBoxProps) => void;
	setValue: (val: string | null) => void;
	data: Array<ComboBoxProps>
}

/** This is the Mantine Select component - https://mantine.dev/core/select/ */
export const SelectComponent = (props: SelectComponentProps) => {
	const { setOption, setValue, ...rest } = props;
	const handleChange = (value: string | null, option: ComboboxItem) => {
		setValue(value);
		if (setOption) {
			const selectedOption = props.data.filter(entry => entry.value === option.value);
			if (selectedOption.length > 0) {
				setOption(selectedOption[0]);
			}
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
