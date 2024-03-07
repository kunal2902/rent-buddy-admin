import {
	BarChart3,
	ShieldCheck,
	Users,
	Warehouse,
	Clipboard,
	Settings,
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
