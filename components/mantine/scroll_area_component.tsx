"use client";

import React from "react";
import {
	ScrollArea, ScrollAreaProps,
} from "@mantine/core";

/** Props list of Mantine's ScrollArea component - https://mantine.dev/core/scroll-area/?t=props */
export interface ScrollAreaComponentProps extends ScrollAreaProps {

}

/** This is the Mantine ScrollArea component - https://mantine.dev/scroll-area/group/ */
export const ScrollAreaComponent = (props: ScrollAreaComponentProps) =>
	<ScrollArea
		{...props}
	>
		{props.children}
	</ScrollArea>;
