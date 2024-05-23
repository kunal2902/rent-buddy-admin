import { ComboBoxProps } from "@/types";

/** Search items for searching in Name, ID or Added By */
export const tagSearchItems = (idLabel: string, idVariable: string): Array<ComboBoxProps> => [
	{
		id: "name",
		label: "Name",
		value: "name",
	},
	{
		id: idVariable,
		label: idLabel,
		value: idVariable,
	},
	{
		id: "added_by",
		label: "Added By",
		value: "added_by",
	},
];
