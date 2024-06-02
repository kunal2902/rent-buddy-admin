"use client";

import React from "react";
import { UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import Link from "next/link";
import { mantineSize } from "@/utils";

/** Props list of Mantine's Unstyled Button component - https://mantine.dev/core/unstyled-button/?t=props */
export interface UnstyledButtonComponentProps extends UnstyledButtonProps {
	href?: string,
	children?: React.ReactNode,
	onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

/** This is the Mantine Unstyled Button component - https://mantine.dev/core/unstyled-button/ */
export const UnstyledButtonComponent = (props: UnstyledButtonComponentProps) =>
// @ts-ignore
	<UnstyledButton
		{...props}
		size={props.size ?? mantineSize}
		{...(props.href ? {
				component: Link,
				href: props.href,
			} :
			{ onClick: props.onClick })}
	>
		{props.children}
	</UnstyledButton>;
