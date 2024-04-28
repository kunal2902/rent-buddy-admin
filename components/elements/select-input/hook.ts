import { SelectOption } from "@/types/common";
import { useEffect, useState } from "react";

interface Args {
	options: Array<SelectOption>;
	value: string;
}

export const useSelectInput = (args: Args) => {
	const { options, value } = args;

	const [selectedLabel, setSelectedLabel] = useState<string>("");

	const onValueChange = () => {
		options.forEach((option) => {
			if (option.value === value) {
				setSelectedLabel(option.name);
			}
		});
	};

	useEffect(() => {
		onValueChange();
	}, [value]);

	return {
		selectedLabel,
	};
};
