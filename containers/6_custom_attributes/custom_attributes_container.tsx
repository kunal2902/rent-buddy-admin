'use client';

import { Plus } from 'lucide-react';
import { Switch, Table } from '@mantine/core';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useCustomAttributesContainer } from './hook';
import { DashboardPageHeader } from '@/components';
import AddCustomAttributeModal from './add_custom_attribute';
import { CustomAttributeModel } from '@/models';
import { deleteAttributeApi, disableAttributeApi, formatDate, getAttributeApi } from '@/utils';
import ActionCustomAttributeModal from './action_custom_attribute_modal';

const CustomAttributesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCustomAttributeModalOpen,
		toggleCreateCustomAttributeModalOpen,
	} = useCustomAttributesContainer();

	const [customAttributesList, setCustomAttributesList] =
		useState<CustomAttributeModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [customAttributeId, setCustomAttributeId] = useState<string>('');
	const [customAttributeType, setCustomAttributeType] = useState<string>('');
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionCustomAttributeModalOpen, setIsActionCustomAttributeModalOpen] =
		useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getAttributeApi((data: any) => {
				setCustomAttributesList(data.customAttributes);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setCustomAttributeId(id);
		setCustomAttributeType(type);
		setIsDisable(disableType);
		setIsActionCustomAttributeModalOpen(true);
	};

	const handleActionCustomAttribute = () => {
		if (customAttributeType === 'disable') {
			disableAttributeApi(customAttributeId, () => {
			setCallApi(true);
			setIsActionCustomAttributeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteAttributeApi(customAttributeId, () => {
			setCallApi(true);
			setIsActionCustomAttributeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const rows = customAttributesList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{element.custom_attribute_id}</Table.Td>
			<Table.Td>{element.custom_attribute_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.type}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.custom_attribute_id, 'disable', element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: '10px' }} onClick={() => handleOpenModal(element.custom_attribute_id, 'delete', element.is_disabled)} />
					<FaRegEdit color="rgba(108, 210, 213, 1)" size={25} />
				</div>
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
				heading="Custom Attributes"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: 'New Attribute',
					titleClassName: 'sm:flex hidden',
					onClick: toggleCreateCustomAttributeModalOpen,
					className: 'rounded-md w-fit text-grey-100 text-sm',
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>Item type Id</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Type</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<AddCustomAttributeModal
				isOpen={isCreateCustomAttributeModalOpen}
				onClose={toggleCreateCustomAttributeModalOpen}
			/>

			<ActionCustomAttributeModal
				isOpen={isActionCustomAttributeModalOpen}
				onClose={() => setIsActionCustomAttributeModalOpen(false)}
				setCallApi={setCallApi}
				handleActionCustomAttribute={handleActionCustomAttribute}
				customAttributeType={customAttributeType}
				isDisable={isDisable}
			/>
		</main>
	);
};

export default CustomAttributesContainer;
