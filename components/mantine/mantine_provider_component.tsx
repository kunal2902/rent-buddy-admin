"use client";

import React from "react";
import {
	MantineProvider, MantineProviderProps,
} from "@mantine/core";

/** Props list of Mantine's MantineProvider component - https://mantine.dev/theming/mantine-provider/#mantineprovider-props */
export interface MantineProviderComponentProps extends MantineProviderProps {

}

/** This is the Mantine MantineProvider component - https://mantine.dev/theming/mantine-provider/ */
export const MantineProviderComponent = (props: MantineProviderComponentProps) => (
	<MantineProvider {...props} />
	);
