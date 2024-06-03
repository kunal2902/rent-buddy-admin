"use client";

import React, { ReactNode } from "react";
import { Paper, PaperProps } from "@mantine/core";
import { mantineRadius } from "@/utils";

/** Props list of Mantine's Paper component - https://mantine.dev/core/paper/?t=props */
export interface PaperComponentProps extends PaperProps {
	children: ReactNode;
}

/** This is the Mantine Paper component - https://mantine.dev/core/paper/ */
export const PaperComponent = (props: PaperComponentProps) => (
	<Paper
		{...props}
		withBorder={props.withBorder ?? true}
		radius={props.radius ?? mantineRadius}
	>
		{props.children}
	</Paper>
);
