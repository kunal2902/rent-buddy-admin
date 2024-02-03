"use client";

import { useHomeScreen } from "./hook";

const HomeScreen = () => {
	const { isSidebarOpen } = useHomeScreen();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			Dashboard page
		</main>
	);
};

export default HomeScreen;
