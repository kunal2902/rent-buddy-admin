"use client";

import { SettingSidebarItems } from "@/constants/sidebar-data";
import { useSettingSidebar } from "./hook";
import { SidebarBtn } from "@/components/elements";

const SettingSidebar = () => {
	const { currentPathname, isSidebarOpen } = useSettingSidebar();
	console.log(currentPathname, isSidebarOpen);

	return (
		<div
			className={`${
				isSidebarOpen ? "lg:w-64 w-56 items-center" : "w-16"
			} h-screen flex flex-col fixed z-20 top-0 left-0 bg-light-background-natural pb-3 pt-14 px-2 border-r border-gray-300/80 border-dashed`}
		>
			<div className="flex-grow flex flex-col w-full px-2 overflow-y-auto pb-2">
				{SettingSidebarItems.map((item) => (
					<SidebarBtn
						key={item.id}
						isActive={item.link === currentPathname}
						isSidebarOpen={isSidebarOpen}
						{...item}
					/>
				))}
			</div>
		</div>
	);
};

export default SettingSidebar;
