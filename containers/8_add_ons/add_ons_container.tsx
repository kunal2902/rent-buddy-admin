"use client";

import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import {
	ActionIconComponent,
	BoxComponent,
	CenterComponent,
	DashboardPageHeader,
	GroupComponent, ImageComponent,
	LoadingOverlayComponent,
	MainComponent, NoDataFound,
	PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps
} from "@/components";
import AddAddOnModal from "./add_add_on_modal";
import { AddOnModel } from "@/models";
import { deleteAddOnApi, disableAddOnApi, formatDate, getAddOnApi, imageUrl } from "@/utils";

const AddOnsContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(15);
	const [addOnId, setAddOnId] = useState<string>("");
	const [addOnName, setAddOnName] = useState<string>("");
	const [addOnPrice, setAddOnPrice] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [total, setTotal] = useState<number>(0);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [addOnsList, setAddOnsList] = useState<AddOnModel[]>([]);
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("add_on_id");
	const [order, setOrder] = useState<string>("asc");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	const initState = async () => {
		setLoading(true);
		await getAddOnApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setAddOnsList(data.add_ons);
				setTotal(data.add_ons_count);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
			}
		);
	};

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		} else {
			setSearchLoading(false);
			initState().then();
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (q: string) => {
		setSearchLoading(true);
		getAddOnApi(
			`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setAddOnsList(data.add_ons);
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

	const handleAddOpenModal = (id: string, name: string, price: string) => {
		setAddOnId(id);
		setAddOnName(name);
		setAddOnPrice(price);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableAddOnApi(
				id,
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				}
			);
		} else {
			await deleteAddOnApi(
				id,
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				}
			);
		}
	};

	const columns = [
		"Index",
		"Add-on Id",
		"Icon",
		"Name",
		"Price",
		"Created At",
		"Created By",
		"Disable",
		"Action",
	];

	const rows = addOnsList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.add_on_id}</Table.Td>
			<Table.Td>
				<ImageComponent
					h={50}
					w="auto"
					src={`${imageUrl}/${element.icon}`}
				/>
			</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.price}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>{element.created_by.name}</Table.Td>
			<Table.Td w={60}>
				<PopConfirmComponent
					entityName="addOn"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.add_on_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="addOn"
						actionName="delete"
						onConfirm={async () => handleAction(element.add_on_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(
							element.add_on_id,
							element.name,
							element.price
						)}
						size="md">
						<MdOutlineEdit size={18} />
					</ActionIconComponent>
				</GroupComponent>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				total={total}
				title="Add Ons"
				filter={filter}
				idLabel="AddOn Id"
				idVariable="add_on_id"
				setFilter={setFilter}
				buttonTitle="Add Add On"
				loading={searchLoading}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				onClick={() => handleAddOpenModal("", "", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					addOnsList.length === 0 ?
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

			{openAddModal &&
				<AddAddOnModal
					id={addOnId}
					name={addOnName}
					price={addOnPrice}
					isOpen={openAddModal}
					setCallApi={setCallApi}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default AddOnsContainer;
