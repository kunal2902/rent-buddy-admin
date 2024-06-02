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
	GroupComponent,
	ImageComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
} from "@/components";
import { ItemTypeModel } from "@/models";
import { deleteItemTypeApi, disableItemTypeApi, formatDate, getItemTypeApi, imageUrl } from "@/utils";
import AddItemTypeModal from "./add_item_type_modal";

const ItemTypesContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [order, setOrder] = useState<string>("asc");
	const [filter, setFilter] = useState<string>("name");
	const [pageSize, setPageSize] = useState<number>(15);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [itemTypeName, setItemTypeName] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("item_type_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [itemTypesList, setItemTypesList] = useState<ItemTypeModel[]>([]);
	const [itemTypeIcon, setItemTypeIcon] = useState<string | undefined>("");

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	const initState = async () => {
		setLoading(true);
		await getItemTypeApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setItemTypesList(data.item_types);
				setTotal(data.item_types_count);
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
		await getItemTypeApi(
			`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setItemTypesList(data.item_types);
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
			await deleteItemTypeApi(
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
		"Item Type Id",
		"Icon",
		"Name",
		"Created At",
		"Created By",
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
			<Table.Td>{element.created_by.name}</Table.Td>
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
				total={total}
				filter={filter}
				title="Item Types"
				setFilter={setFilter}
				idLabel="Item Type Id"
				loading={searchLoading}
				idVariable="item_type_id"
				searchValue={searchValue}
				buttonTitle="Add Item Type"
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
					itemTypesList.length === 0 ?
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
