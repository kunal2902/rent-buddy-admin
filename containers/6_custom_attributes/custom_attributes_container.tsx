"use client";

import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useRef, useState } from "react";
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
} from "@/components";
import AddCustomAttributeModal from "./add_custom_attribute_modal";
import { CustomAttributeModel } from "@/models";
import { deleteAttributeApi, disableAttributeApi, formatDate, getAttributeApi, logoutUser } from "@/utils";
import { useRouter } from "next/navigation";
import ShowNotification from "@/components/mantine/show_notification";
import { checkPermissions } from "@/components/custom/check_permission_entities";

const CustomAttributesContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(15);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [total, setTotal] = useState<number>(0);
	const [customAttributeId, setCustomAttributeId] = useState<string>("");
	const [customAttributeName, setCustomAttributeName] = useState<string>("");
	const [type, setType] = useState<string>("");
	const [defaultValue, setDefaultValue] = useState<string>("");
	const [isTax, setIsTax] = useState<boolean>(false);
	const [taxType, setTaxType] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("custom_attribute_id");
	const [order, setOrder] = useState<string>("asc");
	const [customAttributesList, setCustomAttributesList] = useState<CustomAttributeModel[]>([]);
	const currentQueryRef = useRef(searchValue);

	const canDeleteCustomAttribute = checkPermissions("custom-attribute", ["delete"]);
	const canUpdateCustomAttribute = checkPermissions("custom-attribute", ["update"]);
	const canCreateCustomAttribute = checkPermissions("custom-attribute", ["create"]);
	const canDisableCustomAttribute = checkPermissions("custom-attribute", ["disable"]);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		setLoading(true);
		await getAttributeApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setCustomAttributesList(data.custom_attributes);
				setTotal(data.custom_attributes_count);
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
			getAttributeApi(
				`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
				(data: any) => {
					setCustomAttributesList(data.custom_attributes);
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
		name: string,
		customAttributeType: string,
		default_value: string,
		is_tax: boolean,
		tax_type: string,
	) => {
		setCustomAttributeId(id);
		setCustomAttributeName(name);
		setType(customAttributeType);
		setDefaultValue(default_value);
		setIsTax(is_tax);
		setTaxType(tax_type);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableAttributeApi(
				id,
				() => {
					setCallApi(val => !val);
					ShowNotification("Success", "success");
				},
				(err: any) => {
					setCallApi(val => !val);
					ShowNotification(err.error, "error");
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				}
			);
		} else {
			await deleteAttributeApi(
				id,
				() => {
					setCallApi(val => !val);
					ShowNotification("Success", "success");
				},
				(err: any) => {
					setCallApi(val => !val);
					ShowNotification(err.error, "error");
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
		"Custom Attribute Id",
		"Name",
		"Type",
		"Default Value",
		"Is Tax",
		"Tax Type",
		"Created At",
		"Created By",
		...(canDisableCustomAttribute ? ["Disable"] : []),
		...(canUpdateCustomAttribute && canDeleteCustomAttribute ? ["Action"] : []),
	];

	const rows = customAttributesList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.custom_attribute_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.type}</Table.Td>
			<Table.Td>{element.default_value}</Table.Td>
			<Table.Td>{element.is_tax ? "Yes" : "No"}</Table.Td>
			<Table.Td>{element.is_tax ? element.tax_type?.replace("_", " ") : "-"}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>{element.created_by.name}</Table.Td>
			<Table.Td w={60}>
				{canDisableCustomAttribute &&
					<PopConfirmComponent
						entityName="custom attribute"
						type={PopConfirmType.switch}
						isDisabled={element.is_disabled}
						actionName={element.is_disabled ? "enable" : "disable"}
						onConfirm={async () => handleAction(element.custom_attribute_id, "disable")}
					/>
				}
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					{canDeleteCustomAttribute &&
						<PopConfirmComponent
							entityName="custom attribute"
							actionName="delete"
							onConfirm={async () => handleAction(element.custom_attribute_id, "delete")}
						/>
					}
					{canUpdateCustomAttribute &&
						<ActionIconComponent
							onClick={() => handleAddOpenModal(
								element.custom_attribute_id,
								element.name,
								element.type,
								element.default_value,
								element.is_tax,
								element.tax_type,
							)}
							size="md">
							<MdOutlineEdit size={18} />
						</ActionIconComponent>
					}
				</GroupComponent>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				total={total}
				setFilter={setFilter}
				filter={filter}
				loading={searchLoading}
				title="Custom Attributes"
				searchValue={searchValue}
				idLabel="Custom Attribute Id"
				setSearchValue={setSearchValue}
				idVariable="custom_attribute_id"
				buttonTitle="Add Custom Attribute"
				showAddButton={canCreateCustomAttribute}
				onClick={() => handleAddOpenModal("", "", "", "", false, "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					customAttributesList.length === 0 ?
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
				<AddCustomAttributeModal
					isOpen={openAddModal}
					setCallApi={setCallApi}
					customAttributeId={customAttributeId}
					initialValueName={customAttributeName}
					initialValueType={type}
					initialValueDefaultValue={defaultValue}
					initialValueIsTax={isTax}
					initialValueTaxType={taxType}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default CustomAttributesContainer;
