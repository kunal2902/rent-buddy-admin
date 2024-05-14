import React from 'react';
import {
	Space, SpaceProps,
} from '@mantine/core';
import { mantineSpaceHeight, mantineSpaceWidth } from '@/utils';

/** Props list of Mantine's Space component - https://mantine.dev/core/space/?t=props */
export interface SpaceComponentProps extends SpaceProps {
	showWidth?: boolean,
	showHeight?: boolean,
}

/** This is the Mantine Space component - https://mantine.dev/core/space/ */
export const SpaceComponent = (props: SpaceComponentProps) =>
	<Space
		h={props.showHeight ? mantineSpaceHeight : undefined}
		w={props.showWidth ? mantineSpaceWidth : undefined}
		{...props}
	>
		{props.children}
	</Space>;
