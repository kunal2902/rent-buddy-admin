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
	PaginationComponent, NoDataFound,
} from "@/components";
import { deleteRoleApi, disableRoleApi, formatDate, getRoleApi, getTagApi } from "@/utils";
import { RoleModel } from "@/models";
import AddRoleModal from "./add_role_modal";

const RolesSettingsContainer = () => {
	const [roleId, setRoleId] = useState("");
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(15);
	const [roleName, setRoleName] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [rolesList, setRolesList] = useState<RoleModel[]>([]);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("role_id");
	const [order, setOrder] = useState<string>("asc");

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	const initState = async () => {
		setLoading(true);
		await getRoleApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setRolesList(data.roles);
				setTotal(data.roles_count);
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
		getRoleApi(
			`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setRolesList(data.roles);
				setSearchLoading(false);
			},
			() => {
				setSearchLoading(false);
			},
			() => {
				setSearchLoading(false);
			}
		).then();
		setLoading(false);
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
			await deleteRoleApi(
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
		"Role Id",
		"Name",
		"Is Admin",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = rolesList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.role_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.isAdmin}</Table.Td>
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
				total={total}
				title="Roles"
				filter={filter}
				idLabel="Role Id"
				idVariable="role_id"
				setFilter={setFilter}
				buttonTitle="Add Role"
				loading={searchLoading}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				setOption={(option) => {
					setFilter(option.value);
				}}
				onClick={() => handleAddOpenModal("", "")}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					rolesList.length === 0 ?
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
				<AddRoleModal
					roleId={roleId}
					isOpen={openAddModal}
					setCallApi={setCallApi}
					initialRoleValue={roleName}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default RolesSettingsContainer;
