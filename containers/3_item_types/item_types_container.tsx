"use client";

import React, { useEffect, useRef, useState } from "react";
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
	TableComponent,
	TableTbodyComponent,
	TableTdComponent,
	TableThComponent,
	TableTheadComponent,
	TableTrComponent,
} from "@/components";
import { ItemTypeModel } from "@/models";
import { deleteItemTypeApi, disableItemTypeApi, formatDate, getItemTypeApi, logoutUser } from "@/utils";
import AddItemTypeModal from "./add_item_type_modal";
import ShowNotification from "@/components/mantine/show_notification";

const ItemTypesContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [order, setOrder] = useState<string>("asc");
	const [filter, setFilter] = useState<string>("name");
	const [pageSize, setPageSize] = useState<number>(15);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [itemTypeName, setItemTypeName] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("item_type_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [itemTypesList, setItemTypesList] = useState<ItemTypeModel[]>([]);
	const [itemTypeIcon, setItemTypeIcon] = useState<string | undefined>("");
	const currentQueryRef = useRef(searchValue);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		setLoading(true);
		await getItemTypeApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setItemTypesList(data.item_types);
				setTotal(data.item_types_count);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
				logoutUser(router);
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
		if (q === currentQueryRef.current) {
			setSearchLoading(true);
			await getItemTypeApi(
				`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
				(data: any) => {
					setItemTypesList(data.item_types);
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

	const handleAddOpenModal = (id: string, name: string, icon: string | undefined) => {
		setItemTypeId(id);
		setItemTypeName(name);
		setItemTypeIcon(icon);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, type: string) => {
		if (type === "disable") {
			await disableItemTypeApi(
				id,
				(response) => {
					setCallApi(val => !val);
					ShowNotification(response.message, "success");
				},
				(err) => {
					setCallApi(val => !val);
					ShowNotification(err, "error");
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				}
			);
		} else {
			await deleteItemTypeApi(
				id,
				(response) => {
					setCallApi(val => !val);
					ShowNotification(response.message, "success");
				},
				(err) => {
					setCallApi(val => !val);
					ShowNotification(err, "error");
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
		"Item Type Id",
		"Icon",
		"Name",
		"Created At",
		"Created By",
		"Disable",
		"Action",
	];

	const rows = itemTypesList.map((element, index) => (
		<TableTrComponent key={index}>
			<TableTdComponent>{index + 1}</TableTdComponent>
			<TableTdComponent>{element.item_type_id}</TableTdComponent>
			<TableTdComponent>
				<ImageComponent
					h={50}
					w="auto"
					src={element.icon}
				/>
			</TableTdComponent>
			<TableTdComponent>{element.name}</TableTdComponent>
			<TableTdComponent>{formatDate(element.created_at)}</TableTdComponent>
			<TableTdComponent>{element.created_by.name}</TableTdComponent>
			<TableTdComponent w={60}>
				<PopConfirmComponent
					entityName="item type"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.item_type_id, "disable")}
				/>
			</TableTdComponent>
			<TableTdComponent w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="item type"
						actionName="delete"
						onConfirm={async () => handleAction(element.item_type_id, "delete")}
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
			</TableTdComponent>
		</TableTrComponent>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				total={total}
				filter={filter}
				title="Item Types"
				setFilter={setFilter}
				idLabel="Item Type Id"
				loading={searchLoading}
				idVariable="item_type_id"
				searchValue={searchValue}
				buttonTitle="Add Item Type"
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
					itemTypesList.length === 0 ?
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
										<TableTbodyComponent>{rows}</TableTbodyComponent>
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
				<AddItemTypeModal
					icon={itemTypeIcon}
					isOpen={openAddModal}
					itemTypeId={itemTypeId}
					setCallApi={setCallApi}
					initialItemTypeValue={itemTypeName}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default ItemTypesContainer;
