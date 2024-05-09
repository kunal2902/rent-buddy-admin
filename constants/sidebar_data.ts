import {
	BarChart3,
	ShieldCheck,
	Users,
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
	Bookmark,
	Blocks,
} from "lucide-react";
import { IconType } from "react-icons";
import { PiWarehouse, PiWarehouseFill } from "react-icons/pi";
import { RiSettingsFill, RiSettingsLine } from "react-icons/ri";

type SidebarElement = {
  id: number;
  title: string;
  Icon: IconType | LucideIcon;
} & (
  | {
      type: "sub-menu";
      ActiveIcon: IconType | LucideIcon;
      subMenu: Array<{
        id: number;
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

export const SidebarItems: Array<SidebarElement> = [
	{
		id: 1,
		title: "Dashboard",
		link: "/",
		Icon: BarChart3,
		type: "simple",
	},
	{
		id: 2,
		title: "Inventory",
		Icon: PiWarehouse,
		ActiveIcon: PiWarehouseFill,
		type: "sub-menu",
		subMenu: [
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
			{
				id: 6,
				title: "Tags",
				link: "/inventory/tags",
				Icon: Bookmark,
			},
			{
				id: 7,
				title: "Add Ons",
				link: "/inventory/add-ons",
				Icon: Blocks,
			},
		],
	},
	{
		id: 3,
		title: "Customers",
		link: "/page.tsx",
		Icon: Users,
		type: "simple",
	},
	{
		id: 4,
		title: "Team",
		link: "/team",
		Icon: ShieldCheck,
		type: "simple",
	},
	{
		id: 5,
		title: "Reports",
		link: "/reports",
		Icon: Clipboard,
		type: "simple",
	},
	{
		id: 6,
		title: "Settings",
		Icon: RiSettingsLine,
		ActiveIcon: RiSettingsFill,
		type: "sub-menu",
		subMenu: [
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
		],
	},
];
