"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "@mantine/hooks";
import { MdOutlineEdit } from "react-icons/md";
import {
	ActionIconComponent, BoxComponent, CenterComponent,
	DashboardPageHeader,
	GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound, PaginationComponent, PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps, TableComponent, TableTbodyComponent,
	TableTdComponent, TableThComponent, TableTheadComponent,
	TableTrComponent,
} from "@/components";
import {
	deleteWarrantyApi,
	disableWarrantyApi,
	formatDate,
	getWarrantyApi,
	logoutUser,
} from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";
import { checkPermissions } from "@/components/custom/check_permission_entities";
import { WarrantyModel } from "@/models/warranty_modal";
import AddWarrantyModal from "@/containers/14_warranties/add_warranties_modal";

const WarrantiesContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [order, setOrder] = useState<string>("asc");
	const [filter, setFilter] = useState<string>("");
	const [pageSize, setPageSize] = useState<number>(15);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("warranty_id");
	const [warrantyTitle, setWarrantyTitle] = useState<string>("");
	const [price, setPrice] = useState<number | undefined | string>(0);
	const [maxPrice, setMaxPrice] = useState<number | undefined | string>(0);
	const [minPrice, setMinPrice] = useState<number | undefined | string>(0);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [warrantiesList, setWarrantiesList] = useState<WarrantyModel[]>([]);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [warrantyId, setWarrantyId] = useState<string>("");

	const canDeleteWarranty = checkPermissions("warranty", ["delete"]);
	const canUpdateWarranty = checkPermissions("warranty", ["update"]);
	const canCreateWarranty = checkPermissions("warranty", ["create"]);
	const canDisableWarranty = checkPermissions("warranty", ["disable"]);

	const currentQueryRef = useRef(searchValue);
	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		setLoading(true);
		await getWarrantyApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			// `orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setWarrantiesList(data.warranty);
				setTotal(data.count);
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
			await getWarrantyApi(
				`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
				(data: any) => {
					setWarrantiesList(data.warranty);
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

	const handleAddOpenModal = (
		id: string,
		warranty_title: string,
		warranty_price: string | number | undefined,
		min_price: string | number | undefined,
		max_price: string | number | undefined,
	) => {
		setWarrantyId(id);
		setWarrantyTitle(warranty_title);
		setPrice(warranty_price);
		setMinPrice(min_price);
		setMaxPrice(max_price);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableWarrantyApi(
				id,
				() => {
					setCallApi(val => !val);
					ShowNotification("Success", "success");
				},
				(err) => {
					ShowNotification(err.error, "error");
					setCallApi(val => !val);
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				}
			);
		} else {
			await deleteWarrantyApi(
				id,
				() => {
					setCallApi(val => !val);
					ShowNotification("Success", "success");
				},
				(err) => {
					ShowNotification(err.error, "error");
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
		"Warranty Id",
		"Warranty Title",
		"Price",
		"Minimum Price",
		"Maximum Price",
		"Created At",
		"Created By",
		...(canDisableWarranty ? ["Disable"] : []),
		...(canUpdateWarranty && canDeleteWarranty ? ["Action"] : []),
	];

	const rows = warrantiesList.map((element, index) => (
		<TableTrComponent key={index}>
			<TableTdComponent>{index + 1}</TableTdComponent>
			<TableTdComponent>{element.warranty_id}</TableTdComponent>
			<TableTdComponent>{element.warranty_title}</TableTdComponent>
			<TableTdComponent>{element.price}</TableTdComponent>
			<TableTdComponent>{element.min_price}</TableTdComponent>
			<TableTdComponent>{element.max_price}</TableTdComponent>
			<TableTdComponent>{formatDate(element.created_at)}</TableTdComponent>
			<TableTdComponent>{element.created_by.name}</TableTdComponent>
			<TableTdComponent w={60}>
				{canDisableWarranty &&
					<PopConfirmComponent
						entityName="warranty"
						type={PopConfirmType.switch}
						isDisabled={element.is_disabled}
						actionName={element.is_disabled ? "enable" : "disable"}
						onConfirm={async () => handleAction(element.warranty_id, "disable")}
					/>
				}
			</TableTdComponent>
			<TableTdComponent w={110}>
				<GroupComponent>
					{canDeleteWarranty &&
						<PopConfirmComponent
							entityName="warranty"
							actionName="delete"
							onConfirm={async () => handleAction(element.warranty_id, "delete")}
						/>
					}
					{canUpdateWarranty &&
						<ActionIconComponent
							onClick={() => handleAddOpenModal(
								element.warranty_id,
								element.warranty_title,
								element.price,
								element.min_price,
								element.max_price,
							)}
							size="md">
							<MdOutlineEdit size={18} />
						</ActionIconComponent>
					}
				</GroupComponent>
			</TableTdComponent>
		</TableTrComponent>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				total={total}
				filter={filter}
				title="Warranties"
				idLabel="Warranty Id"
				setFilter={setFilter}
				loading={searchLoading}
				idVariable="warranty_id"
				searchValue={searchValue}
				buttonTitle="Add Warranty"
				setSearchValue={setSearchValue}
				showAddButton={canCreateWarranty}
				onClick={() => handleAddOpenModal("", "", "", "", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					warrantiesList.length === 0 ?
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
				<AddWarrantyModal
					isOpen={openAddModal}
					warrantyId={warrantyId}
					setCallApi={setCallApi}
					initialPriceValue={price}
					initialMinPrice={minPrice}
					initialMaxPrice={maxPrice}
					initialWarrantyTitleValue={warrantyTitle}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default WarrantiesContainer;
