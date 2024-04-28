"use client";

import { DashboardPageHeader } from "@/components/common";
import { useItemsScreen } from "./hook";
import { Plus } from "lucide-react";

const ItemsScreen = () => {
	const { isSidebarOpen } = useItemsScreen();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Items"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Item",
					className: "rounded-md w-fit text-grey-100 text-sm",
					titleClassName: "sm:flex hidden",
					leftIconClassName: "sm:mr-2 mr-0",
					LeftIcon: Plus,
					leftIconSize: 20,
				}}
			/>
		</main>
	);
};

export default ItemsScreen;
