"use client";

import { Plus } from "lucide-react";
import { ComboboxItem, Image, Loader, Switch, Table } from "@mantine/core";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { useSubCategoriesContainer } from "./hook";
import {
	ButtonComponent,
	DashboardPageHeader,
	GroupComponent,
	SelectComponent,
	SortButtonComponent, SortButtonComponentItemProps, SortItemDirection, TextComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { SubCategoryModel } from "@/models";
import { deleteSubCategoryApi, disableSubCategoryApi, formatDate, getSubCategoryApi, imageUrl } from "@/utils";
import CreateSubCategoryModal from "./add_sub_category_modal";
import ActionSubCategoryModal from "./action_sub_category_modal";

const SubCategoriesContainer = () => {
	const {
		isSidebarOpen,
		isCreateSubCategoryModalOpen,
		toggleCreateSubCategoryModalOpen,
	} = useSubCategoriesContainer();

	const [subCategoryList, setSubCategoryList] = useState<SubCategoryModel[]>(
		[],
	);
	const [callApi, setCallApi] = useState(true);
	const [subCatId, setSubCatId] = useState<string>("");
	const [subCatType, setSubCatType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionSubCatModalOpen, setIsActionSubCatModalOpen] = useState<boolean>(false);
	const [catId, setCatId] = useState<string>("");
	const [catType, setCatType] = useState<string>("");
	const [catName, setCatName] = useState<string>("");
	const [catImage, setCatImage] = useState<string | undefined>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [filter, setFilter] = useState<string | null>("tag_id");
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);

	useEffect(() => {
		if (callApi) {
			getSubCategoryApi((data: any) => {
				setSubCategoryList(data.subCategories);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setSubCatId(id);
		setSubCatType(type);
		setIsDisable(disableType);
		setIsActionSubCatModalOpen(true);
	};

		const handleActionSubCat = () => {
		if (subCatType === "disable") {
			disableSubCategoryApi(subCatId, () => {
			setCallApi(true);
			setIsActionSubCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteSubCategoryApi(subCatId, () => {
			setCallApi(true);
			setIsActionSubCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const handleUpsertItemTypeModal = (
		id: string, name: string, image: string | undefined, type: string) => {
		setSubCatId(id);
		// setSubCatName(name);
		// setSubCatImage(image);
		toggleCreateSubCategoryModalOpen();
		setSubCatType(type);
	};

	const rows = subCategoryList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.sub_category_id}</Table.Td>
			<Table.Td>
				<Image
					radius="md"
					h={50}
					w="auto"
					src={`${imageUrl}/${element.icon}`}
				/>
			</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.sub_category_id, "disable", element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: "10px" }} onClick={() => handleOpenModal(element.category_id, "delete", element.is_disabled)} />
					<FaRegEdit color="rgba(108, 210, 213, 1)" size={25} />
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
						<TextComponent text="Add Category" />
					</ButtonComponent>
				</GroupComponent>

			</GroupComponent>

			{/*<DashboardPageHeader*/}
			{/*	heading="Sub Categories"*/}
			{/*	className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"*/}
			{/*	button*/}
			{/*	buttonProps={{*/}
			{/*		title: "New Sub Category",*/}
			{/*		titleClassName: "sm:flex hidden",*/}
			{/*		onClick: toggleCreateSubCategoryModalOpen,*/}
			{/*		className: "rounded-md w-fit text-grey-100 text-sm",*/}
			{/*		children: <Plus size={20} className="mr-0" />,*/}
			{/*	}}*/}
			{/*/>*/}

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>Sub category Id</Table.Th>
						<Table.Th>Icon</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Sub name</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<CreateSubCategoryModal
				isOpen={isCreateSubCategoryModalOpen}
				onClose={toggleCreateSubCategoryModalOpen}
				setCallApi={setCallApi}
			/>

			<ActionSubCategoryModal
				isOpen={isActionSubCatModalOpen}
				onClose={() => setIsActionSubCatModalOpen(false)}
				setCallApi={setCallApi}
				handleActionSubCat={handleActionSubCat}
				subCatType={subCatType}
				isDisable={isDisable}
			/>

		</main>
	);
};

export default SubCategoriesContainer;
