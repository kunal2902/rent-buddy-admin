"use client";

import React from "react";
import { Badge, BadgeProps } from "@mantine/core";
import { appColor, mantineRadius } from "@/utils";

/** Props list of Mantine's Badge component - https://mantine.dev/core/badge/?t=props */
export interface BadgeComponentProps extends BadgeProps {

}

/** This is the Mantine Badge component - https://mantine.dev/core/badge/ */
export const BadgeComponent = (props: BadgeComponentProps) =>
	<Badge
		color={appColor}
		radius={mantineRadius}
		{...props}
	>
		{props.children}
	</Badge>;
