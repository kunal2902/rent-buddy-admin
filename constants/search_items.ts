import { GroupedComboBoxProps } from "@/types";

/** Search items for searching in Name, ID or Added By */
export const searchItems = (idLabel: string, idVariable: string): Array<GroupedComboBoxProps> => ([{
	group: "Searching in",
	items: [
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
			id: "created_by",
			label: "Added By",
			value: "created_by",
		},
	],
}]);

/** Search items for searching in Name, ID or Added By */
export const searchItemsLogs: Array<ComboBoxProps> = [
	{
		id: "activity_logs_id",
		label: "Activity Logs Id",
		value: "activity_logs_id",
	},
	{
		id: "action",
		label: "Action",
		value: "action",
	},
	{
		id: "entity",
		label: "Entity",
		value: "entity",
	},
	{
		id: "performed_by",
		label: "Performed By",
		value: "performed_by",
	},
];

/** Search items when searching by Action */
export const actionItemsLogs: Array<ComboBoxProps> = [
	{
		id: "create",
		label: "Create",
		value: "create",
	},
	{
		id: "view",
		label: "View",
		value: "view",
	},
	{
		id: "update",
		label: "Update",
		value: "update",
	},
	{
		id: "delete",
		label: "Delete",
		value: "delete",
	},
];

/** Search items when searching by Entity */
export const entityItemsLogs: Array<ComboBoxProps> = [
	{
		id: "item_type",
		label: "Item Type",
		value: "item_type",
	},
	{
		id: "category",
		label: "Category",
		value: "category",
	},
	{
		id: "sub_category",
		label: "Sub-category",
		value: "sub_category",
	},
	{
		id: "tag",
		label: "Tag",
		value: "tag",
	},
	{
		id: "custom_attribute",
		label: "Custom Attribute",
		value: "custom_attribute",
	},
	{
		id: "add_on",
		label: "Add-on",
		value: "add_on",
	},
	{
		id: "item",
		label: "Item",
		value: "item",
	},
	{
		id: "role",
		label: "Role",
		value: "role",
	},
	{
		id: "user",
		label: "User",
		value: "user",
	},
	{
		id: "invoice",
		label: "Invoice",
		value: "invoice",
	},
	{
		id: "customer",
		label: "Customer",
		value: "customer",
	},
	{
		id: "cart",
		label: "Cart",
		value: "cart",
	},
	{
		id: "location",
		label: "Location",
		value: "location",
	},
];
