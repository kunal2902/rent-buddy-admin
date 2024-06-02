import React from "react";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { ComboBoxProps } from "@/types";
import { mantineInputVariant, mantineRadius, mantineSize } from "@/utils";

export interface MultiSelectComponentProps extends Omit<MultiSelectProps, "data"> {
	setOption?: (option: ComboBoxProps) => void;
	setValue: (val: string[]) => void;
	data: ComboBoxProps[];
}

export const MultiSelectComponent: React.FC<MultiSelectComponentProps> = (props) => {
	const { setOption, setValue, data, ...rest } = props;
	const handleChange = (value: string[]) => {
		setValue(value);

		if (setOption) {
			const selectedOptions = data.filter(entry => value.includes(entry.value));
			if (selectedOptions.length > 0) {
				selectedOptions.forEach(option => setOption(option));
			}
		}
	};

	return (
		<MultiSelect
			onChange={handleChange}
			data={data}
			size={rest.size ?? mantineSize}
			radius={rest.radius ?? mantineRadius}
			variant={rest.variant ?? mantineInputVariant}
			{...rest}
		/>
	);
};