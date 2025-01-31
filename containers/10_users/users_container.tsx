"use client";

import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
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
import { deleteUserApi, disableUserApi, formatDate, getUserId, getUsersApi, logoutUser } from "@/utils";
import AddUserModal from "./add_user_modal";
import ShowNotification from "@/components/mantine/show_notification";
import { checkPermissions } from "@/components/custom/check_permission_entities";

const UsersContainer = () => {
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(15);
	const [userId, setUserId] = useState("");
	const [page, setPage] = useState<number>(1);
	const [initialValueUserName, setInitialValueUserName] = useState<string>("");
	const [initialValueName, setInitialValueName] = useState<string>("");
	const [initialValueEmail, setInitialValueEmail] = useState<string>("");
	const [initialValuePassword, setInitialValuePassword] = useState<string>("");
	const [initialValueRoleId, setInitialValueRoleId] = useState<string | undefined>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [usersList, setUsersList] = useState<UserModel[]>([]);
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("user_id");
	const [order, setOrder] = useState<string>("asc");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const currentQueryRef = useRef(searchValue);

	const canDeleteUsers = checkPermissions("user", ["delete"]);
	const canUpdateUsers = checkPermissions("user", ["update"]);
	const canCreateUsers = checkPermissions("user", ["create"]);
	const canDisableUsers = checkPermissions("user", ["disable"]);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		await getUsersApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setUsersList(data.users);
				setTotal(data.users_count);
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
					logoutUser(router);
				}
			).then();
		}
	}, 500);

	const handleAddOpenModal = (
		id: string,
		name: string,
		userName: string,
		email: string,
		password: string,
		roleId?: string,
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
			await deleteUserApi(
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
		"User Id",
		"Name",
		"User name",
		"Email",
		"Created At",
		...(canDisableUsers ? ["Disable"] : []),
		...(canUpdateUsers && canDeleteUsers ? ["Action"] : []),
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
					getUserId() !== element.user_id && canDisableUsers &&
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
						getUserId() !== element.user_id && canDeleteUsers &&
						<PopConfirmComponent
							entityName="user"
							actionName="delete"
							onConfirm={async () => handleAction(element.user_id, "delete")}
						/>
					}
					{
						canUpdateUsers &&
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
					}
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
				showAddButton={canCreateUsers}
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
