import { Tooltip, TooltipProps } from '@mantine/core';
import React from 'react';

/** Props list of Mantine's Tooltip component - https://mantine.dev/core/tooltip/?t=props */
export interface TooltipComponentProps extends TooltipProps {

}

/** This is the Mantine Tooltip component - https://mantine.dev/core/tooltip/ */
export const TooltipComponent = (props: TooltipComponentProps) =>
	<Tooltip
		{...props}
	>
		{props.children}
	</Tooltip>;
