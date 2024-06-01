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
import { UserModel } from "@/models";
import { deleteUserApi, disableUserApi, formatDate, getItemTypeApi, getUserId, getUsersApi } from "@/utils";
import AddUserModal from "./add_user_modal";

const UsersContainer = () => {
	const [total, setTotal] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(15);
	const [userId, setUserId] = useState("");
	const [page, setPage] = useState<number>(1);
	const [initialValueUserName, setInitialValueUserName] = useState<string>("");
	const [initialValueName, setInitialValueName] = useState<string>("");
	const [initialValueEmail, setInitialValueEmail] = useState<string>("");
	const [initialValuePassword, setInitialValuePassword] = useState<string>("");
	const [initialValueRoleId, setInitialValueRoleId] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [usersList, setUsersList] = useState<UserModel[]>([]);
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("user_id");
	const [order, setOrder] = useState<string>("asc");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	const initState = async () => {
		await getUsersApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setUsersList(data.users);
				setTotal(data.users.length);
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
		setLoading(true);
		getUsersApi(
			`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setUsersList(data.users);
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
	}, 500);

	const handleAddOpenModal = (
		id: string,
		name: string,
		userName: string,
		email: string,
		password: string,
		roleId: string,
		) => {
		setUserId(id);
		setInitialValueName(name);
		setInitialValueUserName(userName);
		setInitialValueEmail(email);
		setInitialValuePassword(password);
		setInitialValueRoleId(roleId);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableUserApi(
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
			await deleteUserApi(
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
		"User Id",
		"Name",
		"User name",
		"Email",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = usersList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.user_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.username}</Table.Td>
			<Table.Td>{element.email}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				{
					getUserId() !== element.user_id &&
					<PopConfirmComponent
						entityName="user"
						type={PopConfirmType.switch}
						isDisabled={element.is_disabled}
						actionName={element.is_disabled ? "enable" : "disable"}
						onConfirm={async () => handleAction(element.user_id, "disable")}
					/>
				}
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					{
						getUserId() !== element.user_id &&
						<PopConfirmComponent
							entityName="user"
							actionName="delete"
							onConfirm={async () => handleAction(element.user_id, "delete")}
						/>
					}
					<ActionIconComponent
						onClick={() => handleAddOpenModal(
							element.user_id,
							element.name,
							element.username,
							element.email,
							element.password,
							element.role_id,
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
				title="Users"
				filter={filter}
				idLabel="User Id"
				loading={searchLoading}
				idVariable="user_id"
				setFilter={setFilter}
				buttonTitle="Add User"
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				setOption={(option) => {
					setFilter(option.value);
				}}
				onClick={() => handleAddOpenModal("", "", "", "", "", "")}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					usersList.length === 0 ?
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
				<AddUserModal
					userId={userId}
					isOpen={openAddModal}
					setCallApi={setCallApi}
					initialValueName={initialValueName}
					initialValueUserName={initialValueUserName}
					initialValueEmail={initialValueEmail}
					initialValuePassword={initialValuePassword}
					initialRoleId={initialValueRoleId}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default UsersContainer;
