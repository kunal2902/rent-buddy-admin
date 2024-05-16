import React from "react";
import {
	Center, CenterProps,
} from "@mantine/core";

/** Props list of Mantine's Center component - https://mantine.dev/core/center/?t=props */
export interface CenterComponentProps extends CenterProps {

}

/** This is the Mantine Center component - https://mantine.dev/core/center/ */
export const CenterComponent = (props: CenterComponentProps) =>
	<Center
		{...props}
	>
		{props.children}
	</Center>;
