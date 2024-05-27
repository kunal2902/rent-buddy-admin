"use client";

import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import {
	ActionIconComponent,
	BoxComponent,
	CenterComponent,
	DashboardPageHeader,
	GroupComponent, ImageComponent,
	LoadingOverlayComponent,
	MainComponent, PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
} from "@/components";
import { ItemTypeModel } from "@/models";
import {
	deleteItemTypeApi,
	disableItemTypeApi,
	formatDate,
	getItemTypeApi,
	imageUrl,
} from "@/utils";
import AddItemTypeModal from "@/containers/3_item_types/add_item_type_modal";

const ItemTypesContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [itemTypeName, setItemTypeName] = useState<string>("");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [filter, setFilter] = useState<string | null>("item_type_id");
	const [itemTypesList, setItemTypesList] = useState<ItemTypeModel[]>([]);
	const [itemTypeIcon, setItemTypeIcon] = useState<string | undefined>("");

	useEffect(() => {
		if (callApi) {
			getItemTypeApi(
				`orderBy=${filter}&page=${page}&order=asc`,
				(data: any) => {
					console.log(data);
					setItemTypesList(data.item_types);
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
			getItemTypeApi(
				`name=${query}`,
				(data: any) => {
					setItemTypesList(data.item_types);
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

	const handleAddOpenModal = (id: string, name: string, icon: string | undefined) => {
		setItemTypeId(id);
		setItemTypeName(name);
		setItemTypeIcon(icon);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, type: string) => {
		if (type === "disable") {
			await disableItemTypeApi(
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
			await deleteItemTypeApi(
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
		"Item Type Id",
		"Icon",
		"Name",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = itemTypesList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.item_type_id}</Table.Td>
			<Table.Td>
				<ImageComponent
					h={50}
					w="auto"
					src={`${imageUrl}/${element.icon}`}
				/>
			</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				<PopConfirmComponent
					entityName="item type"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.item_type_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="item type"
						actionName="delete"
						onConfirm={async () => handleAction(element.item_type_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(
							element.item_type_id,
							element.name,
							element.icon)}
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
				title="Item Types"
				idLabel="Item Type Id"
				loading={loading}
				idVariable="item_type_id"
				setFilter={setFilter}
				buttonTitle="Add Item Type"
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				onClick={() => handleAddOpenModal("", "", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
				}}
			/>

			{
				itemTypesList.length === 0 ?
					<LoadingOverlayComponent
						visible={itemTypesList.length === 0}
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

			{openAddModal &&
				<AddItemTypeModal
					icon={itemTypeIcon}
					isOpen={openAddModal}
					itemTypeId={itemTypeId}
					setCallApi={setCallApi}
					initialItemTypeValue={itemTypeName}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default ItemTypesContainer;
