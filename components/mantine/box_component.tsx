"use client";

import React, { ReactNode } from "react";
import {
	Box, BoxProps,
} from "@mantine/core";

/** Props list of Mantine's Box component - https://mantine.dev/core/box/?t=props */
export interface BoxComponentProps extends BoxProps {
	children: ReactNode
}

/** This is the Mantine Box component - https://mantine.dev/core/box/ */
export const BoxComponent = (props: BoxComponentProps) =>
	<Box {...props}>{props.children}</Box>;
