"use client";

import React from "react";
import { Card, CardProps } from "@mantine/core";

/** Props list of Mantine's Card component - https://mantine.dev/core/card/?t=props */
export interface CardComponentProps extends CardProps {

}

/** This is the Mantine Card component - https://mantine.dev/core/card/ */
export const CardComponent = (props: CardComponentProps) =>
	<Card
		{...props}
	>
		{props.children}
	</Card>;
