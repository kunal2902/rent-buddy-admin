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
	LoadingOverlayComponent, PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
	MainComponent } from "@/components";
import { UserModel } from "@/models";
import { deleteUserApi, disableUserApi, formatDate, getUserId, getUsersApi } from "@/utils";
import AddUserModal from "./add_user_modal";

const UsersContainer = () => {
	const [userId, setUserId] = useState("");
	const [page, setPage] = useState<number>(1);
	const [userName, setUserName] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [usersList, setUsersList] = useState<UserModel[]>([]);
	const [filter, setFilter] = useState<string | null>("user_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getUsersApi(
				`orderBy=${filter}&page=${page}&order=asc`,
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
		}
	}, [filter, page, callApi]);

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
			getUsersApi(
				`name=${query}`,
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
		}
	}, 500);

	const handleAddOpenModal = (id: string, name: string) => {
		setUserId(id);
		setUserName(name);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableUserApi(
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
			await deleteUserApi(
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
		"User Id",
		"Name",
		"User name",
		"Email",
		"Phone",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = usersList.map((element, index) => (
		<Table.Tr>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.user_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.username}</Table.Td>
			<Table.Td>{element.email}</Table.Td>
			<Table.Td>{element.phone}</Table.Td>
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
					{
						getUserId() !== element.user_id &&
						<ActionIconComponent
							onClick={() => handleAddOpenModal(element.user_id, element.name)}
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
				title="Users"
				idLabel="User Id"
				loading={loading}
				idVariable="user_id"
				setFilter={setFilter}
				buttonTitle="Add User"
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
				usersList.length === 0 ?
					<LoadingOverlayComponent
						visible={usersList.length === 0}
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
				<AddUserModal
					userId={userId}
					setCallApi={setCallApi}
					initialUserValue={userName}
					isOpen={openAddModal}
					onClose={() => {
						setOpenAddModal(false);
					}}
				/>
			}
		</MainComponent>
	);
};

export default UsersContainer;
