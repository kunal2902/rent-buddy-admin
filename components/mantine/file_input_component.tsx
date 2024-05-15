import { FileInput, FileInputProps } from '@mantine/core';

/** Props list of Mantine's TextInput component - https://mantine.dev/core/text-input/?t=props */
export interface FileInputComponentProps extends FileInputProps {

}

/** This is the Mantine FileInput component - https://mantine.dev/core/file-input/ */
export const FileInputComponent = (props: FileInputComponentProps) =>
	<FileInput
		{...props}
		clearable
		accept="image/png,image/jpeg"
		label={props.label}
		placeholder={props.placeholder}
    />;
