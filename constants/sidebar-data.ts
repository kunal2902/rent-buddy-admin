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
} from "lucide-react";

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
		link: "/inventory",
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
		title: "Item Type",
		link: "/inventory/item-type",
		Icon: ScanBarcode,
	},
	{
		id: 3,
		title: "Category",
		link: "/inventory/category",
		Icon: Tag,
	},
	{
		id: 4,
		title: "Sub Category",
		link: "/inventory/sub-category",
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
];
