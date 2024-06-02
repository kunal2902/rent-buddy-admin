"use client";

import React from "react";
import { Pagination, PaginationProps } from "@mantine/core";
import { mantineRadius } from "@/utils";

/** Props list of Mantine's Pagination component - https://mantine.dev/theming/pagination/#mantineprovider-props */
export interface PaginationComponentProps extends PaginationProps {

}

/** This is the Mantine Pagination component - https://mantine.dev/theming/pagination/ */
export const PaginationComponent = (props: PaginationComponentProps) => (
	<Pagination
		{...props}
		mt={12}
		radius={props.radius ?? mantineRadius}
	/>
);
