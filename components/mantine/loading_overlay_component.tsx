"use client";

import React from "react";
import { LoadingOverlay, LoadingOverlayProps } from "@mantine/core";
import { getSurfaceColor, mantineRadius, useThemeProvider } from "@/utils";

/** Props list of Mantine's LoadingOverlay component - https://mantine.dev/core/loading-overlay/?t=props */
export interface LoadingOverlayComponentProps extends LoadingOverlayProps {
}

/** This is the Mantine LoadingOverlay component - https://mantine.dev/core/loading-overlay/ */
export const LoadingOverlayComponent = (props: LoadingOverlayComponentProps) => {
	const { darkMode } = useThemeProvider();
	return (
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
	);
};
