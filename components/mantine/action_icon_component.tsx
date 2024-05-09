import {
	ActionIcon,
	ActionIconProps,
} from "@mantine/core";
import React from "react";
import Link from "next/link";
import { appColorRGBA, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's Action Icon component - https://mantine.dev/core/action-icon/?t=props */
export interface ActionIconComponentProps extends ActionIconProps {
	href?: string
	onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

/** This is the Mantine Action Icon component - https://mantine.dev/core/action-icon/ */
export const ActionIconComponent = (props: ActionIconComponentProps) =>
// @ts-ignore
	<ActionIcon
		{...props}
		size={props.size ?? mantineSize}
		color={props.color ?? appColorRGBA}
		radius={props.radius ?? mantineRadius}
		{...(props.href ? { component: { Link }, href: props.href } :
			{ onClick: props.onClick })}
	>
		{props.children}
	</ActionIcon>;
