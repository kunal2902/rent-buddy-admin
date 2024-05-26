import React from "react";
import { getBackgroundColor, useSidebarState, useThemeProvider } from "@/utils";

export interface MainComponentProps {

}

export const MainComponent = (props: MainComponentProps) => {
	const { darkMode } = useThemeProvider();
	const { isSidebarOpen } = useSidebarState();
	return (
		<main
			className={`flex min-h-screen w-full flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-14"
			}`}
			style={getBackgroundColor(darkMode)}
			{...props}
		>
		</main>
	);
};
