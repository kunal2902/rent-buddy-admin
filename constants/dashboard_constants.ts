import { Blocks, Bookmark, List, LucideIcon, ScanBarcode, ScanLine, ShieldCheck, Tag, Tags, Users } from "lucide-react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IconType } from "react-icons";
import {
	addOnsName,
	categoriesName,
	customAttributesName,
	customersName,
	itemsName,
	itemTypesName, reportsName,
	subCategoriesName, tagsName, usersName,
} from "@/utils";

export interface DashboardConstantsProps {
	title: string;
	Icon: IconType | LucideIcon;
}

export const dashboardConstants : Record<string, DashboardConstantsProps> = {
	add_ons: {
		title: addOnsName,
		Icon: Blocks,
	},
	categories: {
		title: categoriesName,
		Icon: Tag,
	},
	custom_attributes: {
		title: customAttributesName,
		Icon: List,
	},
	customers: {
		title: customersName,
		Icon: Users,
	},
	item_types: {
		title: itemTypesName,
		Icon: ScanBarcode,
	},
	items: {
		title: itemsName,
		Icon: ScanLine,
	},
	sub_categories: {
		title: subCategoriesName,
		Icon: Tags,
	},
	tags: {
		title: tagsName,
		Icon: Bookmark,
	},
	transactions: {
		title: reportsName,
		Icon: HiOutlineDocumentReport,
	},
	users: {
		title: usersName,
		Icon: ShieldCheck,
	},
};
