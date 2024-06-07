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

	/*return (
		<LoadingOverlay
			mt={116}
			mr={12}
			ml={68}
			mb={12}
			zIndex={10}
			overlayProps={{
			radius: mantineRadius,
			backgroundOpacity: 1,
			color: getSurfaceColor(darkMode).backgroundColor,
		}}
			{...props}
	/>
	);*/
};
