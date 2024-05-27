import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { SortButtonComponentItemProps, SortItemDirection } from "@/components";

/** Provides Sort items by ID, Name and Date in asc/desc direction */
export const sortItems = (idVariable: string): Array<SortButtonComponentItemProps> => [
	{
		id: 1,
		icon: GoSortAsc,
		value: idVariable,
		label: "Id - ascending",
		direction: SortItemDirection.ascending,
	},
	{
		id: 2,
		icon: GoSortDesc,
		value: idVariable,
		label: "Id - descending",
		direction: SortItemDirection.descending,
	},
	{
		id: 3,
		value: "name",
		icon: GoSortAsc,
		label: "Name - ascending",
		direction: SortItemDirection.ascending,
	},
	{
		id: 4,
		value: "name",
		label: "Name - descending",
		icon: GoSortDesc,
		direction: SortItemDirection.descending,
	},
	{
		id: 5,
		icon: GoSortAsc,
		value: "created_by",
		label: "Date - ascending",
		direction: SortItemDirection.ascending,
	},
	{
		id: 6,
		icon: GoSortDesc,
		value: "created_by",
		label: "Date - descending",
		direction: SortItemDirection.descending,
	},
	{
		id: 7,
		icon: GoSortAsc,
		value: "created_by",
		label: "Added By - ascending",
		direction: SortItemDirection.ascending,
	},
	{
		id: 8,
		icon: GoSortDesc,
		value: "created_by",
		label: "Added By - descending",
		direction: SortItemDirection.descending,
	},
];
