"use client";

import { Plus } from "lucide-react";
import { Loader, LoadingOverlay, Pagination, Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { MdOutlineEdit } from "react-icons/md";
import {
	ActionIconComponent,
	BoxComponent,
	ButtonComponent,
	CenterComponent,
	DashboardPageHeader,
	GroupComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SelectComponent,
	SortButtonComponent,
	SortButtonComponentItemProps,
	TextComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { useItemsContainer } from "./hook";
import { ItemModel } from "@/models";
import {
	appColorRGBA,
	deleteItemApi,
	disableItemApi,
	formatDate,
	getBackgroundColor,
	getItemApi,
	getSurfaceColor,
	mantineRadius,
	useThemeProvider,
} from "@/utils";
import AddItemModal from "./add_item_modal";
import { searchItems, sortItems } from "@/constants";

const ItemsContainer = () => {
	const { isSidebarOpen } = useItemsContainer();
	const { darkMode } = useThemeProvider();
	const [itemList, setItemList] = useState<ItemModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [itemId, setItemId] = useState<string>("");
	const [itemName, setItemName] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [filter, setFilter] = useState<string | null>("item_id");

	useEffect(() => {
		if (callApi) {
			getItemApi(
				`orderBy=${filter}&page=${page}&order=asc`,
				(data: any) => {
					setItemList(data.item);
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}).then();
		}
	}, [callApi]);

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
			getItemApi(
				`name=${query}`,
				(data: any) => {
					setItemList(data.tags);
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
		<main
			className={`flex min-h-screen w-full flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-14"
			}`}
			style={getBackgroundColor(darkMode)}
		>
			<DashboardPageHeader
				title="Items"
				idLabel="Item Id"
				loading={loading}
				idVariable="item_id"
				setFilter={setFilter}
				buttonTitle="Add Item"
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				setOption={(option) => {
					setFilter(option.value);
				}}
				onClick={() => handleAddOpenModal("", "")}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
				}}
			/>

			{
				itemList.length === 0 ?
					<LoadingOverlay
						mt={116}
						mr={12}
						ml={68}
						mb={12}
						zIndex={10}
						visible={itemList.length === 0}
						overlayProps={{
							radius: mantineRadius,
							backgroundOpacity: 1,
							color: getSurfaceColor(darkMode).backgroundColor,
						}}
					/> :
					<BoxComponent style={{ overflow: "hidden" }} className="mx-3">
						<BoxComponent mx="auto">
							<PaperComponent withBorder radius={mantineRadius}>
								<Table highlightOnHover>
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Index</Table.Th>
											<Table.Th>Item Id</Table.Th>
											<Table.Th>Name</Table.Th>
											<Table.Th>Created At</Table.Th>
											<Table.Th>Disable</Table.Th>
											<Table.Th>Action</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>{rows}</Table.Tbody>
								</Table>
							</PaperComponent>
							<CenterComponent>
								<Pagination
									mt={12}
									total={10}
									value={page}
									radius={mantineRadius}
									onChange={(pageNumber) => {
										setPage(pageNumber);
									}}
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
		</main>
	);
};

export default ItemsContainer;
