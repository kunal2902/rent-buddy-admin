"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Table, Image, Loader, Pagination, LoadingOverlay } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useItemTypesContainer } from "./hook";
import {
	ActionIconComponent,
	BoxComponent,
	ButtonComponent, CenterComponent,
	GroupComponent, PaperComponent, PopConfirmComponent, PopConfirmType,
	SelectComponent,
	SortButtonComponent, SortButtonComponentItemProps, TextComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { ItemTypeModel } from "@/models";
import {
	appColorRGBA,
	deleteItemTypeApi,
	disableItemTypeApi,
	formatDate,
	getBackgroundColor,
	getItemTypeApi, getSurfaceColor,
	imageUrl,
	mantineRadius, useThemeProvider,
} from "@/utils";
import AddItemTypeModal from "@/containers/3_item_types/add_item_type_modal";
import { searchItems, sortItems } from "@/constants";

const ItemTypesContainer = () => {
	const { isSidebarOpen,
		isCreateItemTypeModalOpen,
		toggleCreateItemTypeModalOpen,
	} = useItemTypesContainer();
	const { darkMode } = useThemeProvider();
	const [itemTypeList, setItemTypeList] = useState<ItemTypeModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [itemTypeName, setItemTypeName] = useState<string>("");
	const [itemTypeImage, setItemTypeImage] = useState<string | undefined>("");
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
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			await deleteItemTypeApi(id, () => {
			setCallApi(true);
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
		setItemTypeImage(image);
		toggleCreateItemTypeModalOpen();
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
			<Table.Td w={110}>
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

	return (
		<main
			className={`flex min-h-screen w-full flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-14"
			}`}
			style={getBackgroundColor(darkMode)}
		>
			<GroupComponent
				className="m-3"
				align="center"
				justify="space-between">
				<TitleComponent title="Item Types" />
				<GroupComponent>
					<SelectComponent
						placeholder="Searching In"
						searchable
						size="sm"
						data={searchItems("Item Type Id", "item_type_id")}
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
						items={sortItems("item_type_id")}
						onSelected={(selected: SortButtonComponentItemProps) => {
							console.log(selected.label);
						}}
					/>

					<ButtonComponent
						c={appColorRGBA}
						color={getSurfaceColor(darkMode).backgroundColor}
						onClick={() => handleAddOpenModal("", "", "")}
					>
						<Plus size={20} className="sm:mr-2 mr-0" />
						<TextComponent text="Add Item Type" c={appColorRGBA} />
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
						overlayProps={{
							radius: mantineRadius,
							backgroundOpacity: 0.1,
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
					initialItemTypeValue={itemTypeName}
					image={itemTypeImage}
					setCallApi={setCallApi}
					isOpen={isCreateItemTypeModalOpen}
					onClose={toggleCreateItemTypeModalOpen}
				/>
			}

		</main>
	);
};

export default ItemTypesContainer;
