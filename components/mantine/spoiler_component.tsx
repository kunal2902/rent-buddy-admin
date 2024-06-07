"use client";

import React from "react";
import { Spoiler, SpoilerProps } from "@mantine/core";

/** Props list of Mantine's Spoiler component - https://mantine.dev/core/spoiler/?t=props */
export interface SpoilerComponentProps extends SpoilerProps {

}

/** This is the Mantine Spoiler component - https://mantine.dev/core/spoiler/ */
export const SpoilerComponent = (props: SpoilerComponentProps) =>
	<Spoiler
		{...props}
	>
		{props.children}
	</Spoiler>;
