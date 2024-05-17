"use client";

import React from "react";
import {
	Text, TextProps,
} from "@mantine/core";

/** Props list of Mantine's Text component - https://mantine.dev/core/text/?t=props */
export interface TextComponentProps extends TextProps {
	bold?: boolean,
	text: string,
}

/** This is the Mantine Text component - https://mantine.dev/core/text/ */
export const TextComponent = (props: TextComponentProps) =>
	<Text
		{...props}
		fw={props.bold ? 700 : 0}
	>
		{props.text}
	</Text>;
