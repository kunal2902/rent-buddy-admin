import {
	Avatar,
	AvatarProps,
} from '@mantine/core';
import React from 'react';
import { appColorRGBA, mantineAvatarVariant, mantineRadius, mantineSize } from '@/utils';

/** Props list of Mantine's Avatar component - https://mantine.dev/core/avatar/?t=props */
export interface AvatarComponentProps extends AvatarProps {

}

/** This is the Mantine Avtar component - https://mantine.dev/core/avatar/ */
export const AvatarComponent = (props: AvatarComponentProps) =>
	<Avatar
		{...props}
		autoContrast
		size={mantineSize}
		color={appColorRGBA}
		radius={mantineRadius}
		variant={mantineAvatarVariant}
	>
		{props.children}
	</Avatar>;
