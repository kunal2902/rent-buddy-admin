"use client";

import { DashboardPageHeader } from "@/components";
import { useDashboardContainer } from "./hook";

const DashboardContainer = () => {
	const { isSidebarOpen } = useDashboardContainer();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Hi, Welcome back 👋"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
			/>
		</main>
	);
};

export default DashboardContainer;
