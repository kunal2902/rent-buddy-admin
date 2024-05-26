"use client";

import { DashboardPageHeader } from "@/components";
import { useDashboardContainer } from "./hook";
import { getBackgroundColor, useThemeProvider } from "@/utils";

const DashboardContainer = () => {
	const { darkMode } = useThemeProvider();
	const { isSidebarOpen } = useDashboardContainer();

	return (
		<main
			className={`flex min-h-screen w-full flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
			style={getBackgroundColor(darkMode)}
		>
			<DashboardPageHeader
				heading="Hi, Welcome back 👋"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
			/>
		</main>
	);
};

export default DashboardContainer;
