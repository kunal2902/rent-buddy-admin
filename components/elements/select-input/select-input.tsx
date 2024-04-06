"use client";

import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SelectOption } from "@/types/common";
import { SelectItem } from "@radix-ui/react-select";
import { twMerge } from "tailwind-merge";
import { useSelectInput } from "./hook";

interface Props {
	title: string;
	className?: string;
	titleClassName?: string;
	options: Array<SelectOption>;
	value: string;
	onSelect: (option: string) => void;
	placeholder?: string;
	selectTriggerClassName?: string;
	selectValueClassName?: string;
	selectedTextClassName?: string;
	selectContentClassName?: string;
	selectItemClassName?: string;
}

const SelectInput = (props: Props) => {
	const {
		title,
		className,
		titleClassName,
		options,
		value,
		onSelect,
		placeholder,
		selectContentClassName,
		selectItemClassName,
		selectTriggerClassName,
		selectValueClassName,
		selectedTextClassName,
	} = props;

	const { selectedLabel } = useSelectInput({
		options,
		value,
	});

	return (
		<div
			className={twMerge(
				"w-full flex flex-col items-start font-sans",
				className
			)}
		>
			<p
				className={twMerge(
					"font-public-sans text-light-primary-text text-sm",
					titleClassName
				)}
			>
				{title}
			</p>

			<Select onValueChange={onSelect}>
				<SelectTrigger
					className={twMerge(
						"outline-none focus:ring-0 border focus-visible:ring-0 border-grey-900 px-4 py-2 mt-1 text-light-primary-text bg-light-background-paper",
						selectTriggerClassName
					)}
				>
					<SelectValue
						className={twMerge(
							"outline-none focus:outline-none text-light-primary-text font-public-sans",
							selectValueClassName
						)}
						placeholder={placeholder}
					>
						<span
							className={twMerge(
								"outline-none focus:outline-none text-light-primary-text font-public-sans text-base",
								selectedTextClassName
							)}
						>
							{selectedLabel}
						</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent
					className={twMerge(
						"border border-grey-900",
						selectContentClassName
					)}
				>
					{options.map((option) => (
						<SelectItem
							key={option.id}
							value={option.value}
							className={twMerge(
								"px-2 py-1 my-0.5 hover:cursor-pointer text-base text-light-primary-text",
								selectItemClassName
							)}
						>
							{option.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default SelectInput;
