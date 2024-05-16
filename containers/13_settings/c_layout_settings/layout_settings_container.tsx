"use client";

import { DashboardPageHeader } from "@/components";
import { useLayoutSettingsContainer } from "./hook";

const LayoutSettingsContainer = () => {
	const { isSidebarOpen } = useLayoutSettingsContainer();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Page Layout"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
			/>
		</main>
	);
};

export default LayoutSettingsContainer;
