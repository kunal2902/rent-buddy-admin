import {
	BarChart3,
	ShieldCheck,
	Users,
	Warehouse,
	Clipboard,
	Settings,
	ScanLine,
	ScanBarcode,
	Tag,
	Tags,
	List,
	LayoutPanelTop,
	BookOpenText,
	CreditCard,
	Mail,
	LucideIcon,
} from "lucide-react";
import { IconType } from "react-icons";

type SidebarElement = {
	id: string;
	title: string;
	Icon: IconType | LucideIcon;
} & (
	| {
			type: "sub-menu";
			subMenu: Array<{
				id: string;
				title: string;
				Icon: IconType | LucideIcon;
				link: string;
			}>;
	  }
	| {
			type: "simple";
			link: string;
	  }
);

export const MainSidebarItems = [
	{
		id: 1,
		title: "Dashboard",
		link: "/",
		Icon: BarChart3,
	},
	{
		id: 2,
		title: "Inventory",
		link: "/inventory/items",
		Icon: Warehouse,
	},
	{
		id: 3,
		title: "Customers",
		link: "/customers",
		Icon: Users,
	},
	{
		id: 4,
		title: "Team",
		link: "/team",
		Icon: ShieldCheck,
	},
	{
		id: 5,
		title: "Reports",
		link: "/reports",
		Icon: Clipboard,
	},
	{
		id: 6,
		title: "Settings",
		link: "/settings",
		Icon: Settings,
	},
];

export const InventorySidebarItems = [
	{
		id: 1,
		title: "Items",
		link: "/inventory/items",
		Icon: ScanLine,
	},
	{
		id: 2,
		title: "Item Types",
		link: "/inventory/item-types",
		Icon: ScanBarcode,
	},
	{
		id: 3,
		title: "Categories",
		link: "/inventory/categories",
		Icon: Tag,
	},
	{
		id: 4,
		title: "Sub Categories",
		link: "/inventory/sub-categories",
		Icon: Tags,
	},
	{
		id: 5,
		title: "Custom Attributes",
		link: "/inventory/custom-attributes",
		Icon: List,
	},
];

export const SettingSidebarItems = [
	{
		id: 1,
		title: "General Setting",
		link: "/settings/general-setting",
		Icon: Settings,
	},
	{
		id: 2,
		title: "Page Layout",
		link: "/settings/page-layout",
		Icon: LayoutPanelTop,
	},
	{
		id: 3,
		title: "Pages",
		link: "/settings/pages",
		Icon: BookOpenText,
	},
	{
		id: 4,
		title: "Payment Gateway",
		link: "/settings/payment-gateway",
		Icon: CreditCard,
	},
	{
		id: 5,
		title: "Email Setting",
		link: "/settings/email-setting",
		Icon: Mail,
	},
	{
		id: 6,
		title: "Taxes",
		link: "/settings/taxes",
		Icon: Mail,
	},
];

export const SidebarItems: Array<SidebarElement> = [
	{
		id: "a",
		title: "Dashboard",
		link: "/",
		Icon: BarChart3,
		type: "simple",
	},
	{
		id: "b",
		title: "Inventory",
		Icon: Warehouse,
		type: "sub-menu",
		subMenu: [
			{
				id: "c",
				title: "Items",
				link: "/inventory/items",
				Icon: ScanLine,
			},
			{
				id: "d",
				title: "Item Types",
				link: "/inventory/item-types",
				Icon: ScanBarcode,
			},
			{
				id: "e",
				title: "Categories",
				link: "/inventory/categories",
				Icon: Tag,
			},
			{
				id: "f",
				title: "Sub Categories",
				link: "/inventory/sub-categories",
				Icon: Tags,
			},
			{
				id: "g",
				title: "Custom Attributes",
				link: "/inventory/custom-attributes",
				Icon: List,
			},
		],
	},
	{
		id: "h",
		title: "Customers",
		link: "/customers",
		Icon: Users,
		type: "simple",
	},
	{
		id: "i",
		title: "Team",
		link: "/team",
		Icon: ShieldCheck,
		type: "simple",
	},
	{
		id: "j",
		title: "Reports",
		link: "/reports",
		Icon: Clipboard,
		type: "simple",
	},
	{
		id: "k",
		title: "Settings",
		Icon: Settings,
		type: "sub-menu",
		subMenu: [
			{
				id: "l",
				title: "General Setting",
				link: "/settings/general-setting",
				Icon: Settings,
			},
			{
				id: "m",
				title: "Page Layout",
				link: "/settings/page-layout",
				Icon: LayoutPanelTop,
			},
			{
				id: "n",
				title: "Pages",
				link: "/settings/pages",
				Icon: BookOpenText,
			},
			{
				id: "o",
				title: "Payment Gateway",
				link: "/settings/payment-gateway",
				Icon: CreditCard,
			},
			{
				id: "p",
				title: "Email Setting",
				link: "/settings/email-setting",
				Icon: Mail,
			},
			{
				id: "q",
				title: "Taxes",
				link: "/settings/taxes",
				Icon: Mail,
			},
		],
	},
];
