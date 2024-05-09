import {
	Button,
	ButtonProps,
} from "@mantine/core";
import React from "react";
import Link from "next/link";
import { appColorRGBA, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's Button component - https://mantine.dev/core/button/?t=props */
export interface ButtonComponentProps extends ButtonProps {
	href?: string
	title: string,
	titleClassName?: string,
	onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

/** This is the Mantine Button component - https://mantine.dev/core/button/ */
export const ButtonComponent = (props: ButtonComponentProps) =>
// @ts-ignore
	<Button
		{...props}
		size={props.size ?? mantineSize}
		color={props.color ?? appColorRGBA}
		radius={props.radius ?? mantineRadius}
		{...(props.href ? { component: Link, href: props.href } :
			{ onClick: props.onClick })}
	>
		{props.children ?? props.title ? <p className={props.titleClassName}>{props.title}</p> : "" }
	</Button>;
