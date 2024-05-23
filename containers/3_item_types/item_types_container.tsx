"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Table, Image, Loader, ComboboxItem, Box, Pagination, LoadingOverlay } from "@mantine/core";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useItemTypesContainer } from "./hook";
import {
	ActionIconComponent,
	BoxComponent,
	ButtonComponent, CenterComponent,
	GroupComponent, PaperComponent, PopConfirmComponent, PopConfirmType,
	SelectComponent,
	SortButtonComponent, SortButtonComponentItemProps, SortItemDirection, TextComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { ItemTypeModel } from "@/models";
import { deleteItemTypeApi, disableItemTypeApi, formatDate, getItemTypeApi, imageUrl, mantineRadius } from "@/utils";
import ActionItemTypeModal from "./action_item_type_modal";
import AddItemTypeModal from "@/containers/3_item_types/add_item_type_modal";

const ItemTypesContainer = () => {
	const { isSidebarOpen,
		isCreateItemTypeModalOpen,
		toggleCreateItemTypeModalOpen,
	} = useItemTypesContainer();
	const [itemTypeList, setItemTypeList] = useState<ItemTypeModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [itemTypeName, setItemTypeName] = useState<string>("");
	const [itemTypeImage, setItemTypeImage] = useState<string | undefined>("");
	const [isActionItemTypeModalOpen, setIsActionItemTypeModalOpen] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [filter, setFilter] = useState<string | null>("tag_id");
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);

	useEffect(() => {
		if (callApi) {
			getItemTypeApi((data: any) => {
				setItemTypeList(data.itemTypes);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleActionItemType = async (id: string, type: string) => {
		if (type === "disable") {
			await disableItemTypeApi(id, () => {
			setCallApi(true);
			setIsActionItemTypeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			await deleteItemTypeApi(id, () => {
			setCallApi(true);
			setIsActionItemTypeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const handleAddOpenModal = (id: string, name: string, image: string | undefined) => {
		setItemTypeId(id);
		setItemTypeName(name);
		toggleCreateItemTypeModalOpen();
		setItemTypeImage(image);
	};

	const rows = itemTypeList.map((element, index) => (
		<Table.Tr>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.item_type_id}</Table.Td>
			<Table.Td>
				<Image
					radius="md"
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
					onConfirm={async () => handleActionItemType(element.item_type_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={100}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="tag"
						actionName="delete"
						onConfirm={async () => handleActionItemType(element.item_type_id, "delete")}
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

	const searchItems: Array<ComboboxItem> = [
		{
			label: "Name",
			value: "name",
		},
		{
			label: "Tag Id",
			value: "tag_id",
		},
	];

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-14"
			}`}
		>
			<GroupComponent className="m-3" align="center" justify="space-between">
				<TitleComponent title="Item Types" />
				<GroupComponent>
					<SelectComponent
						placeholder="Searching In"
						searchable
						size="sm"
						data={searchItems}
						setValue={setFilter}
						setOption={(option) => {
							setFilter(option.value);
						}}
					/>

					<TextInputComponent
						size="sm"
						value={searchValue}
						setValue={setSearchValue}
						placeholder="Search"
						rightSection={loading && <Loader size={20} />}
					/>

					<SortButtonComponent
						items={
							[
								{
									id: 1,
									label: "Id - ascending",
									icon: GoSortAsc,
									direction: SortItemDirection.ascending,
								},
								{
									id: 2,
									label: "Id - descending",
									icon: GoSortDesc,
									direction: SortItemDirection.descending,
								},
								{
									id: 3,
									label: "Name - ascending",
									icon: GoSortAsc,
									direction: SortItemDirection.ascending,
								},
								{
									id: 4,
									label: "Name - descending",
									icon: GoSortDesc,
									direction: SortItemDirection.descending,
								},
								{
									id: 5,
									label: "Date - ascending",
									icon: GoSortAsc,
									direction: SortItemDirection.ascending,
								},
								{
									id: 6,
									label: "Date - descending",
									icon: GoSortDesc,
									direction: SortItemDirection.descending,
								},
							]
						}
						onSelected={(selected: SortButtonComponentItemProps) => {
							console.log(selected.label);
						}}
					/>

					<ButtonComponent
						variant="light"
						onClick={() => handleAddOpenModal("", "", "")}
					>
						<Plus size={20} className="sm:mr-2 mr-0" />
						<TextComponent text="Add Item Type" />
					</ButtonComponent>
				</GroupComponent>

			</GroupComponent>

			{
				itemTypeList.length === 0 ?
					<LoadingOverlay
						mt={116}
						mr={12}
						ml={68}
						mb={12}
						zIndex={10}
						visible={itemTypeList.length === 0}
						overlayProps={{ radius: mantineRadius, backgroundOpacity: 0.1, color: "#000" }}
					/> :
					<BoxComponent style={{ overflow: "hidden" }} className="mx-3">
						<BoxComponent mx="auto">
							<PaperComponent withBorder radius={mantineRadius}>
								<Table highlightOnHover>
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Index</Table.Th>
											<Table.Th>Item type Id</Table.Th>
											<Table.Th>Icon</Table.Th>
											<Table.Th>Name</Table.Th>
											<Table.Th>Created at</Table.Th>
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

			{isCreateItemTypeModalOpen &&
				<AddItemTypeModal
					itemTypeId={itemTypeId}
					setCallApi={setCallApi}
					initialItemTypeValue={itemTypeName}
					image={itemTypeImage}
					isOpen={isCreateItemTypeModalOpen}
					onClose={toggleCreateItemTypeModalOpen}
				/>
			}

		</main>
	);
};

export default ItemTypesContainer;
