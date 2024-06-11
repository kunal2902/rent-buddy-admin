"use client";

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
	TableComponent,
	TableTbodyComponent,
	TableTdComponent,
	TableThComponent,
	TableTheadComponent,
	TableTrComponent,
} from "@/components";
import { SubCategoryModel } from "@/models";
import { deleteSubCategoryApi, disableSubCategoryApi, formatDate, getSubCategoryApi, imageUrl } from "@/utils";
import AddSubCategoryModal from "./add_sub_category_modal";

const SubCategoriesContainer = () => {
	const [pageSize, setPageSize] = useState<number>(15);
	const [page, setPage] = useState<number>(1);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [total, setTotal] = useState<number>(0);
	const [searchValue, setSearchValue] = useState<string>("");
	const [categoryId, setCategoryId] = useState<string>("");
	const [subCategoryId, setSubCategoryId] = useState<string>("");
	const [subCategoryName, setSubCategoryName] = useState<string>("");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("sub_category_id");
	const [order, setOrder] = useState<string>("asc");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [subCatgoryIcon, setSubCategoryIcon] = useState<string | undefined>("");
	const [subCategoryList, setSubCategoryList] = useState<SubCategoryModel[]>([]);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	const initState = async () => {
		setLoading(true);
		await getSubCategoryApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setSubCategoryList(data.sub_categories);
				setTotal(data.sub_categories_count);
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
		getSubCategoryApi(
			`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
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
	}, 500);

	const handleAddOpenModal = (
		id: string,
		name: string,
		icon: string | undefined,
		catId: string
	) => {
		setSubCategoryId(id);
		setSubCategoryName(name);
		setSubCategoryIcon(icon);
		setCategoryId(catId);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableSubCategoryApi(
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
			await deleteSubCategoryApi(
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
		"Sub-category Id",
		"Sub-category Icon",
		"Sub-category Name",
		"Category Name",
		"Created At",
		"Created By",
		"Disable",
		"Action",
	];

	const rows = subCategoryList.map((element, index) => (
		<TableTrComponent key={index}>
			<TableTdComponent>{index + 1}</TableTdComponent>
			<TableTdComponent>{element.sub_category_id}</TableTdComponent>
			<TableTdComponent>
				<ImageComponent
					h={50}
					w="auto"
					src={`${imageUrl}/${element.icon}`}
				/>
			</TableTdComponent>
			<TableTdComponent>{element.name}</TableTdComponent>
			<TableTdComponent>{element.category.name}</TableTdComponent>
			<TableTdComponent>{formatDate(element.created_at)}</TableTdComponent>
			<TableTdComponent>{element.created_by.name}</TableTdComponent>
			<TableTdComponent w={60}>
				<PopConfirmComponent
					entityName="sub category"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.sub_category_id, "disable")}
				/>
			</TableTdComponent>
			<TableTdComponent w={110}>
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
							element.category_id
						)}
						size="md">
						<MdOutlineEdit size={18} />
					</ActionIconComponent>
				</GroupComponent>
			</TableTdComponent>
		</TableTrComponent>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				filter={filter}
				title="Sub-categories"
				total={total}
				setFilter={setFilter}
				loading={searchLoading}
				idLabel="Sub-Category Id"
				searchValue={searchValue}
				idVariable="sub_category_id"
				buttonTitle="Add Sub-category"
				setSearchValue={setSearchValue}
				onClick={() => handleAddOpenModal("", "", "", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
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
									<TableComponent highlightOnHover>
										<TableTheadComponent>
											<TableTrComponent>
												{columns.map((item) =>
													(
														<TableThComponent
															key={item}
														>
															{item}
														</TableThComponent>
													)
												)}
											</TableTrComponent>
										</TableTheadComponent>

										<TableTbodyComponent>
											{rows}
										</TableTbodyComponent>
									</TableComponent>
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
				<AddSubCategoryModal
					subCategoryId={subCategoryId}
					icon={subCatgoryIcon}
					isOpen={openAddModal}
					initialSubCategoryValue={subCategoryName}
					setCallApi={setCallApi}
					initialCategoryIdValue={categoryId}
					onClose={() => setOpenAddModal(false)}
				/>
			}

		</MainComponent>
	);
};

export default SubCategoriesContainer;
