"use client";

import { DashboardPageHeader } from "@/components/common";
import { useCategoriesScreen } from "./hook";
import { Plus } from "lucide-react";

const CategoriesScreen = () => {
	const { isSidebarOpen } = useCategoriesScreen();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Categories"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Category",
					className: "rounded-md w-fit text-grey-100 text-sm",
					titleClassName: "sm:flex hidden",
					leftIconClassName: "sm:mr-2 mr-0",
					LeftIcon: Plus,
					leftIconSize: 20,
					type: "internal",
					link: "/inventory/categories/create"
				}}
			/>
		</main>
	);
};

export default CategoriesScreen;
