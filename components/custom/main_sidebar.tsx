'use client';

import { SidebarItems, SideBarType } from '@/constants';
import { SidebarButton, SubMenuBlock, useMainSidebar } from '@/components';

export const MainSidebar = () => {
	const { isSidebarOpen, currentPathname } = useMainSidebar();

	return (
		<div
			className={`${
				isSidebarOpen ? 'lg:w-64 w-56 items-center' : 'w-16'
			} h-screen flex flex-col fixed z-20 top-0 left-0 bg-light-background-natural pb-3 pt-20 px-2 shadow`}
		>
			<div className="flex-grow flex flex-col w-full px-2 overflow-y-auto pb-2">
				{SidebarItems.map((item) => (
					<div key={item.id}>
						{item.type === 'simple' && (
							<SidebarButton
								isActive={item.link === currentPathname}
								isSidebarOpen={isSidebarOpen}
								{...item}
							/>
						)}

						{item.type === SideBarType.Nested && (
							<SubMenuBlock
								isSidebarOpen={isSidebarOpen}
								options={item.other}
								{...item}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
