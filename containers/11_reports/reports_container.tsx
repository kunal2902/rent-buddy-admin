"use client";

import { Plus } from "lucide-react";
import { DashboardPageHeader } from "@/components";
import { useReportsContainer } from "./hook";

const ReportsContainer = () => {
	const { isSidebarOpen } = useReportsContainer();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Users"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New User",
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} />,
				}}
			/>
		</main>
	);
};

export default ReportsContainer;
