import { ComboBoxProps } from "@/types";

export const CustomAttributeTypeOptions: Array<ComboBoxProps> = [
	{
		id: "string",
		label: "String",
		value: "string",
	},
	{
		id: "number",
		label: "Number",
		value: "number",
	},
	{
		id: "percentage",
		label: "Percentage",
		value: "percentage",
	},
];

export const CustomAttributeTaxTypeOptions: Array<ComboBoxProps> = [
	{
		id: "string",
		label: "On Bill",
		value: "on_bill",
	},
	{
		id: "string",
		label: "On Poduct",
		value: "on_product",
	},
];
