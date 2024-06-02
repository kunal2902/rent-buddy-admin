"use client";

import { Avatar, AvatarProps } from "@mantine/core";
import React from "react";
import { appColorRGBA, mantineAvatarVariant, mantineButtonHeight, mantineRadius, mantineSize } from "@/utils";

/** Props list of Mantine's Avatar component - https://mantine.dev/core/avatar/?t=props */
export interface AvatarComponentProps extends AvatarProps {

}

/** This is the Mantine Avtar component - https://mantine.dev/core/avatar/ */
export const AvatarComponent = (props: AvatarComponentProps) =>
	<Avatar
		{...props}
		size={props.size ?? mantineSize}
		h={props.h ?? mantineButtonHeight}
		w={props.h ?? mantineButtonHeight}
		color={props.color ?? appColorRGBA}
		radius={props.radius ?? mantineRadius}
		variant={props.variant ?? mantineAvatarVariant}
	>
		{props.children}
	</Avatar>;
