"use client";

import { Select, SelectProps } from "@mantine/core";
import React from "react";
import { mantineInputVariant, mantineRadius, mantineSize } from "@/utils";
import { ComboBoxProps, GroupedComboBoxProps } from "@/types";

/** Props list of Mantine's Select component - https://mantine.dev/core/select/?t=props */
export interface SelectComponentProps extends SelectProps {
	setOption?: (option: ComboBoxProps) => void;
	setValue: (val: string) => void;
	data: ComboBoxProps[] | GroupedComboBoxProps[]; // or GroupedComboBoxProps[] if your data is grouped
}

/** This is the Mantine Select component - https://mantine.dev/core/select/ */
export const SelectComponent = (props: SelectComponentProps) => {
	const { setOption, setValue, ...rest } = props;

	const handleChange = (value: string | null) => {
		const option = (props.data as Array<ComboBoxProps>).find(
			(entry) => entry.value === value,
		);

		if (option) {
			setValue(option.value);
			if (setOption) {
				setOption(option);
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
