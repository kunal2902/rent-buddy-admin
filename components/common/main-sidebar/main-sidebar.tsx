"use client";

import { useMainSidebar } from "./hook";

const MainSidebar = () => {
	const { isSidebarOpen } = useMainSidebar();

	return (
		<div
			className={`${
				isSidebarOpen ? "lg:w-64 w-56 items-center" : "w-16"
			} h-screen flex flex-col fixed z-20 top-0 left-0 bg-light-background-natural pb-3 pt-14 px-2 border-r border-gray-300/80 border-dashed`}
		></div>
	);
};

export default MainSidebar;
