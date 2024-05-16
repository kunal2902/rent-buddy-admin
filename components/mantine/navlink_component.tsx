import React from "react";
import {
	NavLink, NavLinkProps,
} from "@mantine/core";
import Link from "next/link";
import { appColorRGBA } from "@/utils";

/** Props list of Mantine's Modal component - https://mantine.dev/core/modal/?t=props */
export interface NavLinkComponentProps extends NavLinkProps {
	href: string;
}

/** This is the Mantine Modal component - https://mantine.dev/core/modal/ */
export const NavLinkComponent = (props: NavLinkComponentProps) =>
	<NavLink
		{...props}
		component={Link}
		href={props.href}
		color={props.color ?? appColorRGBA}
	>
		{props.children}
	</NavLink>;
