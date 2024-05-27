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
import { SubCategoryModel } from "@/models";
import { deleteSubCategoryApi, disableSubCategoryApi, formatDate, getSubCategoryApi, imageUrl } from "@/utils";
import AddSubCategoryModal from "@/containers/5_sub_categories/add_sub_category_modal";

const SubCategoriesContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [categoryName, setCategoryName] = useState<string>("");
	const [subCategoryId, setSubCategoryId] = useState<string>("");
	const [subCategoryName, setSubCategoryName] = useState<string>("");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [filter, setFilter] = useState<string | null>("sub_category_id");
	const [subCatgoryIcon, setSubCategoryIcon] = useState<string | undefined>("");
	const [subCategoryList, setSubCategoryList] = useState<SubCategoryModel[]>([]);

	useEffect(() => {
		getSubCategoryApi(
			`orderBy=${filter}&page=${page}&order=asc`,
			(data: any) => {
				setLoading(false);
				setSubCategoryList(data.sub_categories);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
			}
		).then();
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
			getSubCategoryApi(
				`name=${query}`,
				(data: any) => {
					setSubCategoryList(data.sub_categories);
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

	const handleAddOpenModal = (
		id: string,
		name: string,
		icon: string | undefined,
		catName: string
	) => {
		setSubCategoryId(id);
		setSubCategoryName(name);
		setSubCategoryIcon(icon);
		setCategoryName(catName);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableSubCategoryApi(
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
			await deleteSubCategoryApi(
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
		"Sub-category Id",
		"Sub-category Icon",
		"Sub-category Name",
		"Category Name",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = subCategoryList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.sub_category_id}</Table.Td>
			<Table.Td>
				<ImageComponent
					h={50}
					w="auto"
					src={`${imageUrl}/${element.icon}`}
				/>
			</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.category.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				<PopConfirmComponent
					entityName="sub category"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.sub_category_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="sub category"
						actionName="delete"
						onConfirm={async () => handleAction(element.sub_category_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(
							element.sub_category_id,
							element.name,
							element.icon,
							element.category.name
						)}
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
				setFilter={setFilter}
				title="Sub-categories"
				loading={searchLoading}
				idLabel="Sub-Category Id"
				searchValue={searchValue}
				idVariable="sub_category_id"
				buttonTitle="Add Sub-category"
				setSearchValue={setSearchValue}
				onClick={() => handleAddOpenModal("", "", "", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					subCategoryList.length === 0 ?
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
				<AddSubCategoryModal
					id={subCategoryId}
					icon={subCatgoryIcon}
					isOpen={openAddModal}
					name={subCategoryName}
					setCallApi={setCallApi}
					categoryName={categoryName}
					onClose={() => setOpenAddModal(false)}
				/>
			}

		</MainComponent>
	);
};

export default SubCategoriesContainer;
