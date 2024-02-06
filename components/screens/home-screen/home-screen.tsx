"use client";

import { DashboardPageHeader } from "@/components/common";
import { useHomeScreen } from "./hook";

const HomeScreen = () => {
	const { isSidebarOpen } = useHomeScreen();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Hi, Welcome back 👋"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				// button
				// buttonProps={{
				// 	title: "New User",
				// 	className: "rounded-md w-fit text-grey-100 text-sm",
				// 	LeftIcon: Plus,
				// 	leftIconSize: 20,
				// }}
			/>
		</main>
	);
};

export default HomeScreen;
