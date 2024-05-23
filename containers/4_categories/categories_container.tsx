"use client";

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { Box, ComboboxItem, Image, Loader, Pagination, Switch, Table } from "@mantine/core";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import {
	ButtonComponent, CenterComponent,
	GroupComponent,
	SelectComponent,
	SortButtonComponent, SortButtonComponentItemProps, SortItemDirection, TextComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { useCategoriesContainer } from "./hook";
import CreateCategoryModal from "./add_category";
import { CategoryModel } from "@/models";
import { deleteCategoryApi, disableCategoryApi, formatDate, getCategoryApi, imageUrl } from "@/utils";
import ActionCategoryModal from "./action_category_modal";

const CategoriesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCategoryModalOpen,
		toggleCreateCategoryModalOpen,
	} = useCategoriesContainer();

	const [categoryList, setCategoryList] = useState<CategoryModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [catId, setCatId] = useState<string>("");
	const [catType, setCatType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionCatModalOpen, setIsActionCatModalOpen] = useState<boolean>(false);
	const [catName, setCatName] = useState<string>("");
	const [catImage, setCatImage] = useState<string | undefined>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [filter, setFilter] = useState<string | null>("tag_id");
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);

	useEffect(() => {
		if (callApi) {
			getCategoryApi((data: any) => {
				setCategoryList(data.categories);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setCatId(id);
		setCatType(type);
		setIsDisable(disableType);
		setIsActionCatModalOpen(true);
	};

	const handleActionCat = () => {
		if (catType === "disable") {
			disableCategoryApi(catId, () => {
			setCallApi(true);
			setIsActionCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteCategoryApi(catId, () => {
			setCallApi(true);
			setIsActionCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const handleUpsertItemTypeModal = (
		id: string, name: string, image: string | undefined, type: string) => {
		setCatId(id);
		setCatName(name);
		setCatImage(image);
		toggleCreateCategoryModalOpen();
		setCatType(type);
	};

	const rows = categoryList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.category_id}</Table.Td>
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
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.category_id, "disable", element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: "10px" }} onClick={() => handleOpenModal(element.category_id, "delete", element.is_disabled)} />
					<FaRegEdit color="rgba(108, 210, 213, 1)" size={25} onClick={() => handleUpsertItemTypeModal(element.category_id, element.name, element.icon, "Edit")} />
				</div>
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
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<GroupComponent className="mx-3 my-2" align="center" justify="space-between">
				<TitleComponent title="Categories" />
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
						onClick={() => handleUpsertItemTypeModal("", "", "", "Add")}
					>
						<Plus size={20} className="sm:mr-2 mr-0" />
						<TextComponent text="Add Categories" />
					</ButtonComponent>
				</GroupComponent>

			</GroupComponent>

			<Box style={{ overflow: "hidden" }} className="mx-3">
				<Box mx="auto">
					<Table striped highlightOnHover withTableBorder>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Index</Table.Th>
								<Table.Th>Category Id</Table.Th>
								<Table.Th>Icon</Table.Th>
								<Table.Th>Name</Table.Th>
								<Table.Th>Created at</Table.Th>
								<Table.Th>Disable</Table.Th>
								<Table.Th>Action</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{rows}</Table.Tbody>
					</Table>
					<CenterComponent>
						<Pagination
							total={10}
							value={page}
							onChange={(pageNumber) => {
								setPage(pageNumber);
							}}
							mt="sm"
							radius="lg"
						/>
					</CenterComponent>
				</Box>
			</Box>

			<CreateCategoryModal
				isOpen={isCreateCategoryModalOpen}
				onClose={toggleCreateCategoryModalOpen}
				setCallApi={setCallApi}
				catType={catType}
				name={catName}
				id={catId}
				image={catImage}
			/>

			<ActionCategoryModal
				isOpen={isActionCatModalOpen}
				onClose={() => {
					setIsActionCatModalOpen(false);
					setCatType("");
					setCatImage("");
					setCatName("");
					setCatId("");
				}}
				setCallApi={setCallApi}
				handleActionCat={handleActionCat}
				catType={catType}
				isDisable={isDisable}
			/>
		</main>
	);
};

export default CategoriesContainer;
