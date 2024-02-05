import {
	BarChart3,
	ShieldCheck,
	Users,
	Warehouse,
	Receipt,
	Percent,
	Clipboard,
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
		title: "Users",
		link: "/users",
		Icon: ShieldCheck,
	},
	{
		id: 5,
		title: "Receipts",
		link: "/receipts",
		Icon: Receipt,
	},
	{
		id: 6,
		title: "Taxes",
		link: "/taxes",
		Icon: Percent,
	},
	{
		id: 7,
		title: "Reports",
		link: "/reports",
		Icon: Clipboard,
	},
];
