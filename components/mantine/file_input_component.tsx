"use client";

import { FileInput, FileInputProps } from "@mantine/core";
import { forwardRef, useEffect } from "react";

/** Props list of Mantine's TextInput component - https://mantine.dev/core/file-input/?t=props */

export interface FileInputComponentProps extends FileInputProps {}

/** This is the Mantine FileInput component - https://mantine.dev/core/file-input/ */
export const FileInputComponent = forwardRef<
	HTMLButtonElement,
	FileInputComponentProps
>((props, ref) => {
	useEffect(() => {
		console.log(ref);
	}, [ref]);

	return (
		<FileInput
			clearable
			accept="image/png,image/jpeg"
			label={props.label}
			placeholder={props.placeholder}
			onChange={(e) => console.log(e)}
			ref={ref}
			{...props}
		/>
	);
});
