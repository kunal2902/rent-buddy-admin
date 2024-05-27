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
	GroupComponent,
	LoadingOverlayComponent,
	MainComponent, NoDataFound,
	PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
} from "@/components";
import AddAddOnModal from "./add_add_on_modal";
import { AddOnModel } from "@/models";
import { deleteAddOnApi, disableAddOnApi, formatDate, getAddOnApi } from "@/utils";

const AddOnsContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [addOnId, setAddOnId] = useState<string>("");
	const [addOnName, setAddOnName] = useState<string>("");
	const [addOnPrice, setAddOnPrice] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [addOnsList, setAddOnsList] = useState<AddOnModel[]>([]);
	const [filter, setFilter] = useState<string | null>("add_on_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	useEffect(() => {
			getAddOnApi(
				`orderBy=${filter}&page=${page}&order=asc`,
				(data: any) => {
					setAddOnsList(data.add_ons);
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
			getAddOnApi(
				`name=${query}`,
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
		}
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
					setCallApi(true);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			);
		} else {
			await deleteAddOnApi(
				id,
				() => {
					setCallApi(true);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			);
		}
	};

	const columns = [
		"Index",
		"Add-on Id",
		"Name",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = addOnsList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.add_on_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
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
				title="AddOns"
				idLabel="AddOn Id"
				idVariable="addOn_id"
				setFilter={setFilter}
				buttonTitle="Add AddOn"
				loading={searchLoading}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				onClick={() => handleAddOpenModal("", "", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
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
										total={10}
										value={page}
										onChange={setPage}
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
