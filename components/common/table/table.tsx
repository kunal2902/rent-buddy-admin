"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const TableComponent = (props: TableProps) => {
	return (
		<Table>
			{props.caption && <TableCaption>{props.caption}</TableCaption>}
			<TableHeader>
				<TableRow>
					{props.rows.map((value: TableRow, index) => {
						return (
							<TableHead
								className={
									value.className ? value.className : ""
								}
								key={index}
							>
								{value.title}
							</TableHead>
						);
					})}
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					{props.columns.map((value: TableColumn[]) => {
						return value.map((column: TableColumn, index) => {
							return (
								<TableCell
									className={
										column.className ? column.className : ""
									}
									key={index}
								>
									{column.content}
								</TableCell>
							);
						});
					})}
				</TableRow>
			</TableBody>
		</Table>
	);
};

export default TableComponent;

export type TableProps = {
	rows: TableRow[];
	columns: TableColumn[][];
	className?: string;
	caption?: string;
};

export type TableRow = {
	title: string;
	className?: string;
};

export type TableColumn = {
	content: string;
	action?: Function;
	className?: string;
};
