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
	PaginationComponent,
	PaperComponent,
	SortButtonComponentItemProps,
} from "@/components";
import { formatDate, getReportsAPI } from "@/utils";
import { ReportModel } from "@/models";

const ReportsContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [filter, setFilter] = useState<string | null>("report_id");
	const [reportsList, setReportsList] = useState<ReportModel[]>([]);

	useEffect(() => {
		if (callApi) {
			getReportsAPI(
				`orderBy=${filter}&page=${page}&order=asc`,
				(data: any) => {
					setReportsList(data.reports);
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			).then();
		}
	}, [filter, page, callApi]);

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setLoading(true);
		if (query === "") {
			setCallApi(true);
			setLoading(false);
		} else {
			getReportsAPI(
				`name=${query}`,
				(data: any) => {
					setReportsList(data.reports);
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			).then();
			setLoading(false);
		}
	}, 500);

	const columns = [
		"Index",
		"Report Id",
		"Name",
		"Created At",
	];

	const rows = reportsList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.report_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
		</Table.Tr>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				buttonTitle=""
				title="Reports"
				loading={loading}
				idLabel="Report Id"
				setFilter={setFilter}
				showAddButton={false}
				idVariable="report_id"
				onClick={() => {}}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent
						visible={loading}
					/> :
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
									total={10}
									value={page}
									onChange={setPage}
								/>
							</CenterComponent>
						</BoxComponent>
					</BoxComponent>
			}
		</MainComponent>
	);
};

export default ReportsContainer;
