"use client";

import { Plus } from "lucide-react";
import { Switch, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { DashboardPageHeader } from "@/components";
import { useUsersContainer } from "./hook";
import { UserModel } from "@/models";
import { formatDate, getUsersApi } from "@/utils";

const UsersContainer = () => {
	const { isSidebarOpen } = useUsersContainer();
	const [usersList, setUsersList] = useState<UserModel[]>([]);
	const [callApi, setCallApi] = useState<boolean>(true);

	useEffect(() => {
		if (callApi) {
			getUsersApi((data: any) => {
				setUsersList(data.users);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const rows = usersList.map((element) => (
		<Table.Tr>
			<Table.Td>{element.user_id}</Table.Td>
			<Table.Td>{element.user_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.username}</Table.Td>
			<Table.Td>{element.email}</Table.Td>
			<Table.Td>{element.phone}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			{/* <Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.tag_id, 'disable', element.is_disabled)}
				/>
			</Table.Td> */}
			<Table.Td>
				<FaEye color="rgba(108, 210, 213, 1)" size={25} />
			</Table.Td>
		</Table.Tr>
	));

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Users"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New User",
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>User Id</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>User name</Table.Th>
						<Table.Th>Email</Table.Th>
						<Table.Th>Phone</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

		</main>
	);
};

export default UsersContainer;
