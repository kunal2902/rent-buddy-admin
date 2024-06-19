"use client";

import React from "react";
import { Table, TableProps } from "@mantine/core";

/** Props list of Mantine's Table component - https://mantine.dev/core/table/?t=props */
export interface TableComponentProps extends TableProps {
}

/** This is the Mantine Table component - https://mantine.dev/core/table/ */
export const TableComponent = (props: TableComponentProps) =>
	<Table
		highlightOnHover
		{...props}
	/>;

export const TableTrComponent = Table.Tr;
export const TableTdComponent = Table.Td;
export const TableThComponent = Table.Th;
export const TableTheadComponent = Table.Thead;
export const TableTbodyComponent = Table.Tbody;
