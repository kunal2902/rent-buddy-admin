"use client";

import React, { useEffect, useRef, useState } from "react";
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
	TableComponent,
	TableTbodyComponent,
	TableTdComponent,
	TableThComponent,
	TableTheadComponent,
	TableTrComponent,
} from "@/components";
import { ItemModel } from "@/models";
import { deleteItemApi, disableItemApi, formatDate, getItemApi, logoutUser } from "@/utils";
import AddItemModal, { InitialItemValue } from "./add_item_modal";
import ShowNotification from "@/components/mantine/show_notification";

const initialItemValue: InitialItemValue = {
	item_id: "",
	category_id: "",
	sub_category_id: "",
	add_ons: [],
	name: "",
	internal_name: "",
	description: "",
	short_description: "",
	sku: "",
	images: [],
	icon: "",
	price: "",
	stock_quantity: "",
	created_by_id: "",
	created_at: "",
	is_deleted: false,
	is_disabled: false,
	item_type_id: "",
	created_by: {
		name: "",
	},
	category: {
		name: "",
	},
	sub_category: {
		name: "",
	},
	type: {
		name: "",
	},
	item_tags: [],
	custom_attributes: [],
};

const ItemsContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [items, setItems] = useState<InitialItemValue>(initialItemValue);
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
	const currentQueryRef = useRef(searchValue);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

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
		if (q === currentQueryRef.current) {
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
			).then();
		}
	}, 500);

	const handleAddOpenModal = (element: any) => {
		setItems(element);
		setOpenAddModal(true);
	};

	const handleActionItem = async (id: string, itemType: string) => {
		if (itemType === "disable") {
			await disableItemApi(id,
				() => {
					setCallApi(val => !val);
					ShowNotification("Successfully", "success");
				},
				(err) => {
					setCallApi(val => !val);
					ShowNotification(err.error, "error");
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				});
		} else {
			await deleteItemApi(id,
				() => {
					setCallApi(val => !val);
					ShowNotification("Successfully", "success");
				},
				(err) => {
					setCallApi(val => !val);
					ShowNotification(err.error, "error");
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
		<TableTrComponent key={index}>
			<TableTdComponent>{index + 1}</TableTdComponent>
			<TableTdComponent>{element.item_id}</TableTdComponent>
			<TableTdComponent>{element.name}</TableTdComponent>
			<TableTdComponent>{element.category.name}</TableTdComponent>
			<TableTdComponent>
				{element.sub_category?.name ?? null}
			</TableTdComponent>
			<TableTdComponent>{element.type.name}</TableTdComponent>
			<TableTdComponent>{element.stock_quantity}</TableTdComponent>
			<TableTdComponent>{element.created_by.name}</TableTdComponent>
			<TableTdComponent>
				{formatDate(element.created_at)}
			</TableTdComponent>
			<TableTdComponent w={60}>
				<PopConfirmComponent
					entityName="item"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () =>
						handleActionItem(element.item_id, "disable")
					}
				/>
			</TableTdComponent>
			<TableTdComponent w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="item"
						actionName="delete"
						onConfirm={async () =>
							handleActionItem(element.item_id, "delete")
						}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(element)}
						size="md"
					>
						<MdOutlineEdit size={18} />
					</ActionIconComponent>
				</GroupComponent>
			</TableTdComponent>
		</TableTrComponent>
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
				onClick={() => handleAddOpenModal("")}
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
									<TableComponent>
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
				<AddItemModal
					isOpen={openAddModal}
					setCallApi={setCallApi}
					initialItemValue={items}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default ItemsContainer;
