"use client";

import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
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
import { deleteAttributeApi, disableAttributeApi, formatDate, getAttributeApi } from "@/utils";

const CustomAttributesContainer = () => {
	const [page, setPage] = useState<number>(1);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [filter, setFilter] = useState<string | null>("custom_attribute_id");
	const [customAttribute, setCustomAttribute] = useState<CustomAttributeModel | undefined>();
	const [customAttributesList, setCustomAttributesList] = useState<CustomAttributeModel[]>([]);

	useEffect(() => {
		getAttributeApi(
			`orderBy=${filter}&page=${page}&order=asc`,
			(data: any) => {
				setCustomAttributesList(data.custom_attributes);
				setLoading(false);
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
			getAttributeApi(
				`name=${query}`,
				(data: any) => {
					setCustomAttributesList(data.custom_attributes);
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

	const handleAddOpenModal = (model?: CustomAttributeModel) => {
		setCustomAttribute(model);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableAttributeApi(
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
			await deleteAttributeApi(
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
		"Custom Attribute Id",
		"Name",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = customAttributesList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.custom_attribute_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				<PopConfirmComponent
					entityName="custom attribute"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.custom_attribute_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="custom attribute"
						actionName="delete"
						onConfirm={async () => handleAction(element.custom_attribute_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(element)}
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
				loading={searchLoading}
				title="Custom Attributes"
				searchValue={searchValue}
				idLabel="Custom Attribute Id"
				setSearchValue={setSearchValue}
				idVariable="custom_attribute_id"
				buttonTitle="Add Custom Attribute"
				onClick={() => handleAddOpenModal()}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
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
										total={10}
										value={page}
										onChange={setPage}
									/>
								</CenterComponent>
							</BoxComponent>
						</BoxComponent>
			}

			{openAddModal &&
				<AddCustomAttributeModal
					isOpen={openAddModal}
					setCallApi={setCallApi}
					customAttribute={customAttribute}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default CustomAttributesContainer;
