"use client";

import React from "react";
import {
	Title, TitleProps,
} from "@mantine/core";

/** Props list of Mantine's Title component - https://mantine.dev/core/title/?t=props */
export interface TitleComponentProps extends TitleProps {
	bold?: boolean,
	title: string,
}

/** This is the Mantine Title component - https://mantine.dev/core/title/ */
export const TitleComponent = (props: TitleComponentProps) =>
	<Title
		{...props}
		order={props.order ?? 4}
		fw={props.bold ? 700 : 0}
	>
		{props.title}
	</Title>;
