"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { Table } from "@mantine/core";
import { useRouter } from "next/navigation";
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
import { ActivityLogModel } from "@/models";
import { formatDate, getActivityLogsApi, logoutUser, toTitleCase } from "@/utils";
import { actionItemsLogs, entityItemsLogs, searchItemsLogs } from "@/constants";

const ActivityLogsContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [order, setOrder] = useState<string>("desc");
	const [pageSize, setPageSize] = useState<number>(15);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [filter, setFilter] = useState<string>("activity_log_id");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [activityLogsList, setActivityLogsList] = useState<ActivityLogModel[]>([]);
	const currentQueryRef = useRef(searchValue);

	useEffect(() => {
		initState().then();
	}, [filter, page, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		getActivityLogsApi(
			`orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setActivityLogsList(data.activity_logs);
				setTotal(data.activity_logs_count ?? 0);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
				logoutUser(router);
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
		if (query === currentQueryRef.current) {
			setSearchLoading(true);
			getActivityLogsApi(
				`filter_type=${filter}&filter_query=${query}`,
				(data: any) => {
					setActivityLogsList(data.activity_logs);
					setTotal(data.activity_logs_count ?? 0);
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
					logoutUser(router);
				}
			).then();
		}
	}, 500);

	const columns = [
		"Index",
		"Log Id",
		"Entity",
		"Action",
		"Performed by",
		"Created At",
	];

	const getEntityName = (entity: string) =>
		entityItemsLogs.find(value => value.value === entity)?.label;

	const rows = activityLogsList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.activity_log_id}</Table.Td>
			<Table.Td>{getEntityName(element.action_entity)}</Table.Td>
			<Table.Td>{toTitleCase(element.action)}</Table.Td>
			<Table.Td>{element.performed_by.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
		</Table.Tr>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				idLabel=""
				total={total}
				idVariable=""
				buttonTitle=""
				filter={filter}
				title="Activity Logs"
				setFilter={(value) => {
					setFilter(value);
					setSearchValue("");
				}}
				showAddButton={false}
				loading={searchLoading}
				onClick={() => {}}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				searchSelectItems={searchItemsLogs}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
				showValueSelect={filter === "entity" || filter === "action"}
				valueSelectItems={filter === "entity" ? entityItemsLogs : actionItemsLogs}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					activityLogsList.length === 0 ?
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

export default ActivityLogsContainer;
