"use client";

import React from "react";
import { getSurfaceColor, useThemeProvider } from "@/utils";
import { CenterComponent, TextComponent } from "@/components";

export const NoDataFound = () => {
	const { darkMode } = useThemeProvider();
	return (
		<div
			className="flex-grow overflow-auto h-full"
			style={{
				backgroundColor: getSurfaceColor(darkMode).backgroundColor,
				alignContent: "center",
				margin: "0 12px 12px 12px",
				borderRadius: "8px",
			}}
		>
			<CenterComponent h="100%">
				<TextComponent text="No data found!" />
			</CenterComponent>
		</div>
	);
};
