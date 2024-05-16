'use client';

import { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { DashboardPageHeader } from '@/components';
import { useCustomersContainer } from './hook';
import { CustomerModel } from '@/models';
import { formatDate, getCustomerApi } from '@/utils';

const CustomersContainer = () => {
	const { isSidebarOpen } = useCustomersContainer();
	const [usersList, setUsersList] = useState<CustomerModel[]>([]);
	const [callApi, setCallApi] = useState<boolean>(true);

	useEffect(() => {
		if (callApi) {
			getCustomerApi((data: any) => {
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
			<Table.Td>
				<FaEye color="rgba(108, 210, 213, 1)" size={25} />
			</Table.Td>
		</Table.Tr>
	));
	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? 'lg:pl-64 pl-0' : 'pl-16'
			}`}
		>
			<DashboardPageHeader
				heading="Customers"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
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

export default CustomersContainer;
