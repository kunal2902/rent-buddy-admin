"use client";

import React from "react";
import { getSurfaceColor, useThemeProvider } from "@/utils";
import { CenterComponent, LoaderComponent } from "@/components";

export const LoadingOverlayComponent = () => {
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
				<LoaderComponent size="sm" />
			</CenterComponent>
		</div>
	);
};
