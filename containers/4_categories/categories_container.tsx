"use client";

import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import { useRouter } from "next/navigation";
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
import { CategoryModel } from "@/models";
import { deleteCategoryApi, disableCategoryApi, formatDate, getCategoryApi, imageUrl, logoutUser } from "@/utils";
import AddCategoryModal from "./add_category_modal";

const CategoriesContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [order, setOrder] = useState<string>("asc");
	const [filter, setFilter] = useState<string>("name");
	const [pageSize, setPageSize] = useState<number>(15);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [categoryId, setCategoryId] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [categoryName, setCategoryName] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("category_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [categoryIcon, setCategoryIcon] = useState<string | undefined>("");
	const [categoriesList, setCategoriesList] = useState<CategoryModel[]>([]);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	const initState = async () => {
		setLoading(true);
		await getCategoryApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setCategoriesList(data.categories);
				setTotal(data.categories_count);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
				logoutUser(router);
			}
		).then();
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
		await getCategoryApi(
			`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setCategoriesList(data.categories);
				setSearchLoading(false);
			},
			() => {
				setSearchLoading(false);
			},
			() => {
				setSearchLoading(false);
				logoutUser(router);
			}
		).then();
	}, 500);

	const handleAddOpenModal = (id: string, name: string, icon: string | undefined) => {
		setCategoryId(id);
		setCategoryName(name);
		setCategoryIcon(icon);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableCategoryApi(
				id,
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				}
			);
		} else {
			await deleteCategoryApi(
				id,
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				}
			);
		}
	};

	const columns = [
		"Index",
		"Category Id",
		"Icon",
		"Name",
		"Created At",
		"Created By",
		"Disable",
		"Action",
	];

	const rows = categoriesList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.category_id}</Table.Td>
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
					entityName="category"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.category_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="category"
						actionName="delete"
						onConfirm={async () => handleAction(element.category_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(
							element.category_id,
							element.name,
							element.icon
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
				total={total}
				title="Categories"
				idLabel="Category Id"
				filter={filter}
				setFilter={setFilter}
				loading={searchLoading}
				idVariable="category_id"
				searchValue={searchValue}
				buttonTitle="Add Category"
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
					categoriesList.length === 0 ?
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
				<AddCategoryModal
					icon={categoryIcon}
					isOpen={openAddModal}
					categoryId={categoryId}
					setCallApi={setCallApi}
					initialCategoryValue={categoryName}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default CategoriesContainer;
