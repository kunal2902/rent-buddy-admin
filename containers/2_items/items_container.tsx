"use client";

import { Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { MdOutlineEdit } from "react-icons/md";
import {
	ActionIconComponent,
	BoxComponent,
	CenterComponent,
	DashboardPageHeader,
	GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
} from "@/components";
import { ItemModel } from "@/models";
import { deleteItemApi, disableItemApi, formatDate, getItemApi } from "@/utils";
import AddItemModal from "./add_item_modal";

const ItemsContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [itemId, setItemId] = useState<string>("");
	const [itemName, setItemName] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [itemList, setItemList] = useState<ItemModel[]>([]);
	const [filter, setFilter] = useState<string | null>("item_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);

	useEffect(() => {
			getItemApi(
				`orderBy=${filter}&page=${page}&order=asc`,
				(data: any) => {
					setItemList(data.item);
					setLoading(false);
				},
				() => {
					setLoading(false);
				},
				() => {
					setLoading(false);
				}).then();
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
			getItemApi(
				`name=${query}`,
				(data: any) => {
					setItemList(data.tags);
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

	const handleAddOpenModal = (id: string, name: string) => {
		setItemId(id);
		setItemName(name);
		setOpenAddModal(true);
	};

	const handleActionItem = async (id: string, itemType: string) => {
		if (itemType === "disable") {
			await disableItemApi(id,
				() => {
					setCallApi(true);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				});
		} else {
			await deleteItemApi(id,
				() => {
					setCallApi(true);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				});
		}
	};

	const columns = [
		"Index",
		"Item Id",
		"Name",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = itemList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.item_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				<PopConfirmComponent
					entityName="item"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleActionItem(element.item_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="item"
						actionName="delete"
						onConfirm={async () => handleActionItem(element.item_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(element.item_id, element.name)}
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
				title="Items"
				idLabel="Item Id"
				idVariable="item_id"
				setFilter={setFilter}
				buttonTitle="Add Item"
				loading={searchLoading}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				onClick={() => handleAddOpenModal("", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					itemList.length === 0 ?
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
				<AddItemModal
					itemId={itemId}
					isOpen={openAddModal}
					setCallApi={setCallApi}
					initialItemName={itemName}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default ItemsContainer;
