"use client";

import { useEffect, useState } from "react";
import { Image, Switch, Table } from "@mantine/core";
import { IoTrashOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { DashboardPageHeader } from "@/components";
import { useRolesSettingsContainer } from "./hook";
import { formatDate, getRolesApi, imageUrl } from "@/utils";
import { RoleModel } from "@/models";

const RolesSettingsContainer = () => {
	const { isSidebarOpen } = useRolesSettingsContainer();
	const [callApi, setCallApi] = useState<boolean>(true);
	const [roleList, setRoleList] = useState<RoleModel[]>([]);

	useEffect(() => {
		if (callApi) {
			getRolesApi((data: any) => {
				setRoleList(data.roles);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const rows = roleList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.role_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					// onClick={() => handleOpenModal(element.role_id, "disable", element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline
						color="red"
						size={25}
						style={{ marginRight: "10px" }}
						// onClick={() => handleOpenModal(element.role_id, "delete", element.is_disabled)}
					/>
					<FaRegEdit color="rgba(108, 210, 213, 1)" size={25} />
				</div>
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
				heading="Roles"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>Role Id</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</main>
	);
};

export default RolesSettingsContainer;
