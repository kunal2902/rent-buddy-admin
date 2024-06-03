"use client";

import React from "react";
import { Table, TableProps } from "@mantine/core";

/** Props list of Mantine's Table component - https://mantine.dev/core/table/?t=props */
export interface TableComponentProps extends TableProps {
}

/** This is the Mantine Table component - https://mantine.dev/core/table/ */
export const TableComponent = (props: TableComponentProps) =>
	<Table
		{...props}
		striped={props.striped ?? true}
		highlightOnHover={props.highlightOnHover ?? true}
		withTableBorder={props.withTableBorder ?? true}
		withColumnBorders={props.withColumnBorders ?? true}
	/>;
