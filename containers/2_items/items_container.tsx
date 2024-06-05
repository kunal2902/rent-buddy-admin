"use client";

import { Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
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
import { deleteItemApi, disableItemApi, formatDate, getAddOnApi, getItemApi, logoutUser } from "@/utils";
import AddItemModal from "./add_item_modal";

const ItemsContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [itemId, setItemId] = useState<string>("");
	const [itemName, setItemName] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [itemList, setItemList] = useState<ItemModel[]>([]);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("item_id");
	const [order, setOrder] = useState<string>("asc");
	const [pageSize, setPageSize] = useState<number>(15);
	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	const initState = async () => {
		setLoading(true);
		await getItemApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setItemList(data.items);
				setTotal(data.items_count);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
				logoutUser(router);
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
			getItemApi(
				`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
				(data: any) => {
					setItemList(data.items);
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
					logoutUser(router);
				}
			);
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
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				});
		} else {
			await deleteItemApi(id,
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				});
		}
	};

	const columns = [
		"Index",
		"Item Id",
		"Name",
		"Category",
		"Sub category",
		"Item type",
		"Quantity",
		"Created By",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = itemList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.item_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.category.name}</Table.Td>
			<Table.Td>{element.sub_category.name}</Table.Td>
			<Table.Td>{element.type.name}</Table.Td>
			<Table.Td>{element.stock_quantity}</Table.Td>
			<Table.Td>{element.created_by.name}</Table.Td>
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
				total={total}
				title="Items"
				filter={filter}
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
					setOrderBy(selected.value);
					setOrder(selected.direction);
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
										value={page}
										onChange={setPage}
										total={Math.ceil(total / 15)}
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
