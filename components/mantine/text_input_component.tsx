"use client";

import { TextInput, TextInputProps } from "@mantine/core";
import React from "react";
import {
	appColorRGBA,
	mantineInputVariant,
	mantineRadius,
	mantineSize,
} from "@/utils";
import { useCreateItemTypeModal } from "@/containers/3_item_types/hook";

/** Props list of Mantine's TextInput component - https://mantine.dev/core/text-input/?t=props */
export interface TextInputComponentProps extends TextInputProps {
	initialValue?: string; // Add initialValue prop for initial state
}

/** This is the Mantine TextInput component - https://mantine.dev/core/text-input/ */
export const TextInputComponent = (props: TextInputComponentProps) => {
	const { initialValue, ...rest } = props;
	const { itemTypeName, onItemTypeNameChange } = useCreateItemTypeModal(initialValue);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onItemTypeNameChange(event.target.value);
	};

	return (
		<TextInput
			size={rest.size ?? mantineSize}
			color={rest.color ?? appColorRGBA}
			radius={rest.radius ?? mantineRadius}
			variant={rest.variant ?? mantineInputVariant}
			value={itemTypeName}
			onChange={handleChange}
			{...rest}
		/>
	);
};
