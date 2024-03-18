"use client";

import { SidebarItems } from "@/constants/sidebar-data";
import { useMainSidebar } from "./hook";
import { SidebarBtn, SubMenuBlock } from "@/components/elements";

const MainSidebar = () => {
	const { isSidebarOpen, currentPathname } = useMainSidebar();

	return (
		<div
			className={`${
				isSidebarOpen ? "lg:w-64 w-56 items-center" : "w-16"
			} h-screen flex flex-col fixed z-20 top-0 left-0 bg-light-background-natural pb-3 pt-14 px-2 border-r border-gray-300/80 border-dashed`}
		>
			<div className="flex-grow flex flex-col w-full px-2 overflow-y-auto pb-2">
				{/* {MainSidebarItems.map((item) => (
					<SidebarBtn
						key={item.id}
						isActive={item.link === currentPathname}
						isSidebarOpen={isSidebarOpen}
						{...item}
					/>
				))} */}

				{SidebarItems.map((item) => (
					<>
						{item.type === "simple" && (
							<SidebarBtn
								key={item.id}
								isActive={item.link === currentPathname}
								isSidebarOpen={isSidebarOpen}
								{...item}
							/>
						)}

						{item.type === "sub-menu" && (
							<SubMenuBlock
								key={item.id}
								isSidebarOpen={isSidebarOpen}
								options={item.subMenu}
								{...item}
							/>
						)}
					</>
				))}
			</div>
		</div>
	);
};

export default MainSidebar;
