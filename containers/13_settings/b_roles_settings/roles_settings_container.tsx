"use client";

import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import {
	ActionIconComponent,
	BoxComponent,
	CenterComponent,
	DashboardPageHeader,
	GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
 PaginationComponent } from "@/components";
import { deleteRoleApi, disableRoleApi, formatDate, getRoleApi } from "@/utils";
import { RoleModel } from "@/models";
import AddRoleModal from "./add_role_modal";

const RolesSettingsContainer = () => {
	const [roleId, setRoleId] = useState("");
	const [page, setPage] = useState<number>(1);
	const [roleName, setRoleName] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [rolesList, setRolesList] = useState<RoleModel[]>([]);
	const [filter, setFilter] = useState<string | null>("role_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getRoleApi(
				`orderBy=${filter}&page=${page}&order=asc`,
				(data: any) => {
					setRolesList(data.roles);
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			).then();
		}
	}, [callApi]);

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setLoading(true);
		if (query === "") {
			setCallApi(true);
			setLoading(false);
		} else {
			getRoleApi(
				`name=${query}`,
				(data: any) => {
					setRolesList(data.roles);
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			).then();
			setLoading(false);
		}
	}, 500);

	const handleAddOpenModal = (id: string, name: string) => {
		setRoleId(id);
		setRoleName(name);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableRoleApi(
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
			await deleteRoleApi(
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
		"Role Id",
		"Name",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = rolesList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.role_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				<PopConfirmComponent
					entityName="tag"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.role_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="role"
						actionName="delete"
						onConfirm={async () => handleAction(element.role_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(element.role_id, element.name)}
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
				title="Roles"
				idLabel="Role Id"
				loading={loading}
				idVariable="role_id"
				setFilter={setFilter}
				buttonTitle="Add Role"
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				setOption={(option) => {
					setFilter(option.value);
				}}
				onClick={() => handleAddOpenModal("", "")}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
				}}
			/>

			{
				rolesList.length === 0 ?
					<LoadingOverlayComponent
						visible={rolesList.length === 0}
					/> :
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
									total={10}
									onChange={setPage}
								/>
							</CenterComponent>
						</BoxComponent>
					</BoxComponent>
			}

			{openAddModal &&
				<AddRoleModal
					roleId={roleId}
					setCallApi={setCallApi}
					initialRoleValue={roleName}
					isOpen={openAddModal}
					onClose={() => {
						setOpenAddModal(false);
					}}
				/>
			}
		</MainComponent>
	);
};

export default RolesSettingsContainer;
