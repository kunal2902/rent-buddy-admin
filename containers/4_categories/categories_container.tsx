"use client";

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Image, Loader, LoadingOverlay, Pagination, Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import {
	ActionIconComponent, BoxComponent,
	ButtonComponent, CenterComponent,
	GroupComponent, PaperComponent, PopConfirmComponent, PopConfirmType,
	SelectComponent,
	SortButtonComponent, SortButtonComponentItemProps, TextComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { useCategoriesContainer } from "./hook";
import CreateCategoryModal from "./add_category";
import { CategoryModel } from "@/models";
import {
	appColorRGBA,
	deleteCategoryApi,
	disableCategoryApi,
	formatDate,
	getBackgroundColor,
	getCategoryApi, getSurfaceColor,
	imageUrl, mantineRadius, useThemeProvider,
} from "@/utils";
import { searchItems, sortItems } from "@/constants";

const CategoriesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCategoryModalOpen,
		toggleCreateCategoryModalOpen,
	} = useCategoriesContainer();
	const { darkMode } = useThemeProvider();
	const [categoryList, setCategoryList] = useState<CategoryModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [catId, setCatId] = useState<string>("");
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

	const handleAddOpenModal = (id: string, name: string, image: string | undefined) => {
		setCatId(id);
		setCatName(name);
		setCatImage(image);
		toggleCreateCategoryModalOpen();
	};

	const handleActionCat = async (id: string, type: string) => {
		if (type === "disable") {
			await disableCategoryApi(id, () => {
				setCallApi(true);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			});
		} else {
			await deleteCategoryApi(id, () => {
				setCallApi(true);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			});
		}
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
				<PopConfirmComponent
					entityName="item type"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleActionCat(element.category_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="category"
						actionName="delete"
						onConfirm={async () => handleActionCat(element.category_id, "disable")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(
							element.category_id,
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
				<TitleComponent title="Categories" />
				<GroupComponent>
					<SelectComponent
						placeholder="Searching In"
						searchable
						size="sm"
						data={searchItems("Category Id", "category_id")}
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
						items={sortItems("category_id")}
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
						<TextComponent text="Add Category" c={appColorRGBA} />
					</ButtonComponent>
				</GroupComponent>

			</GroupComponent>

			{
				categoryList.length === 0 ?
					<LoadingOverlay
						mt={116}
						mr={12}
						ml={68}
						mb={12}
						zIndex={10}
						visible={categoryList.length === 0}
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
			{isCreateCategoryModalOpen &&
				<CreateCategoryModal
					catId={catId}
					initialCatValue={catName}
					image={catImage}
					setCallApi={setCallApi}
					isOpen={isCreateCategoryModalOpen}
					onClose={toggleCreateCategoryModalOpen}
				/>
			}
		</main>
	);
};

export default CategoriesContainer;
