"use client";

import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { Table } from "@mantine/core";
import {
	BoxComponent,
	CenterComponent,
	DashboardPageHeader,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent,
	SortButtonComponentItemProps,
} from "@/components";
import { formatDate, getReportsAPI } from "@/utils";
import { ReportModel } from "@/models";

const ReportsContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [order, setOrder] = useState<string>("desc");
	const [filter, setFilter] = useState<string>("name");
	const [pageSize, setPageSize] = useState<number>(15);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [reportsList, setReportsList] = useState<ReportModel[]>([]);

	useEffect(() => {
		initState().then();
	}, [filter, page, orderBy, order]);

	const initState = async () => {
		getReportsAPI(
			`orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setReportsList(data.reports);
				setTotal(data.reports_count ?? 0);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
			}
		).then();
	};

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		} else {
			setSearchLoading(false);
			initState().then();
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setSearchLoading(true);
		getReportsAPI(
			`filter_type=${filter}&filter_query=${query}`,
			(data: any) => {
				setReportsList(data.reports);
				setTotal(data.reports_count ?? 0);
				setSearchLoading(false);
			},
			() => {
				setSearchLoading(false);
			},
			() => {
				setSearchLoading(false);
			}
		).then();
	}, 500);

	const columns = [
		"Index",
		"Invoice ID",
		"Total Selling Amount",
		"Customer Name",
		"Created At",
	];

	const rows = reportsList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.invoice_id}</Table.Td>
			<Table.Td>{element.total_selling_amount}</Table.Td>
			<Table.Td>{element?.customer?.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
		</Table.Tr>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				total={total}
				buttonTitle=""
				title="Reports"
				filter={filter}
				idLabel="Report Id"
				setFilter={setFilter}
				showAddButton={false}
				idVariable="report_id"
				onClick={() => {
				}}
				loading={searchLoading}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					reportsList.length === 0 ?
						<NoDataFound /> :
						<BoxComponent style={{ overflow: "hidden" }} className="mx-3">
							<BoxComponent mx="auto">
								<PaperComponent>
									<Table highlightOnHover>
										<Table.Thead>
											<Table.Tr>
												{columns.map((item) =>
													(<Table.Th key={item}>{item}</Table.Th>)
												)}
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>{rows}</Table.Tbody>
									</Table>
								</PaperComponent>
								<CenterComponent>
									<PaginationComponent
										value={page}
										onChange={setPage}
										total={Math.ceil(total / 15)}
									/>
								</CenterComponent>
							</BoxComponent>
						</BoxComponent>
			}
		</MainComponent>
	);
};

export default ReportsContainer;
