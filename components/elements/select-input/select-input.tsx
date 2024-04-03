"use client";

import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { twMerge } from "tailwind-merge";

interface Props {
	title: string;
	className?: string;
	titleClassName?: string;
}

const SelectInput = (props: Props) => {
	const { title, className, titleClassName } = props;

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

			<Select onValueChange={(value) => console.log(value)}>
				<SelectTrigger className="outline-none focus:outline-none">
					<SelectValue
						placeholder="value"
						className="outline-none focus:outline-none"
					/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="light">Light</SelectItem>
					<SelectItem value="dark">Dark</SelectItem>
					<SelectItem value="system">System</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default SelectInput;
