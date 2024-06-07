"use client";

import React from "react";
import { Fieldset, FieldsetProps } from "@mantine/core";

/** Props list of Mantine's Fieldset component - https://mantine.dev/core/fieldset/?t=props */
export interface FieldsetComponentProps extends FieldsetProps {

}

/** This is the Mantine Fieldset component - https://mantine.dev/core/fieldset/ */
export const FieldsetComponent = (props: FieldsetComponentProps) =>
	<Fieldset
		{...props}
	>
		{props.children}
	</Fieldset>;
