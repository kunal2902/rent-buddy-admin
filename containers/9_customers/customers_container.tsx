"use client";

import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import {
	BoxComponent, CenterComponent,
	DashboardPageHeader,
	LoadingOverlayComponent,
	MainComponent, NoDataFound, PaginationComponent, PaperComponent,
	SortButtonComponentItemProps,
} from "@/components";
import { CustomerModel } from "@/models";
import { formatDate, getCustomersApi } from "@/utils";

const CustomersContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [customersList, setCustomersList] = useState<CustomerModel[]>([]);
	const [filter, setFilter] = useState<string | null>("customer_id");

	useEffect(() => {
			getCustomersApi(
				`orderBy=${filter}&page=${page}&order=asc`,
				(data: any) => {
					setCustomersList(data.customers);
					setLoading(false);
				},
				() => {
					setLoading(false);
				},
				() => {
					setLoading(false);
				}
			).then();
	}, [filter, page, callApi]);

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setSearchLoading(true);
		if (query === "") {
			setSearchLoading(false);
		} else {
			getCustomersApi(
				`name=${query}`,
				(data: any) => {
					setCustomersList(data.customers);
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				}
			).then();
		}
	}, 500);

	const columns = [
		"Index",
		"Customer Id",
		"Name",
		"Email",
		"Phone",
		"Created At",
	];

	const rows = customersList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.customer_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.email}</Table.Td>
			<Table.Td>{element.phone}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
		</Table.Tr>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				buttonTitle=""
				title="Customers"
				idLabel="Customer Id"
				setFilter={setFilter}
				showAddButton={false}
				loading={searchLoading}
				idVariable="customer_id"
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
					<LoadingOverlayComponent /> :
					customersList.length === 0 ?
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

export default CustomersContainer;
