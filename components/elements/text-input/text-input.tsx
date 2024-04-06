"use client";

import { HTMLInputTypeAttribute } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
	className?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	title: string;
	titleClassName?: string;
	placeholder?: string;
	inputClassName?: string;
	type?: HTMLInputTypeAttribute;
}

const TextInput = (props: Props) => {
	const {
		title,
		titleClassName,
		value,
		onChange,
		className,
		placeholder,
		inputClassName,
		type,
	} = props;

	return (
		<div className={twMerge("w-full flex flex-col items-start", className)}>
			<p
				className={twMerge(
					"font-public-sans text-light-primary-text text-sm",
					titleClassName
				)}
			>
				{title}
			</p>

			<input
				className={twMerge(
					"w-full px-4 border border-grey-200 hover:border-gray-800 focus:border-primary-main mt-1 py-3 rounded-lg outline-none text-lg font-base text-light-primary-text placeholder:text-light-secondary-text font-light",
					inputClassName
				)}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				type={type}
			/>
		</div>
	);
};

export default TextInput;
