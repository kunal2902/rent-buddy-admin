'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Switch, Table } from '@mantine/core';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { useItemTypesContainer } from './hook';
import { DashboardPageHeader } from '@/components';
import { ItemTypeModel } from '@/models';
import { deleteItemApi, disableItemTypeApi, formatDate, getItemTypeApi } from '@/utils';
import ActionItemTypeModal from './action_item_type_modal';

const ItemTypesContainer = () => {
	const { isSidebarOpen } = useItemTypesContainer();
	const [itemTypeList, setItemTypeList] = useState<ItemTypeModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [itemTypeId, setItemTypeId] = useState<string>('');
	const [itemType, setItemType] = useState<string>('');
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionItemTypeModalOpen, setIsActionItemTypeModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getItemTypeApi((data: any) => {
				setItemTypeList(data.itemTypes);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setItemTypeId(id);
		setItemType(type);
		setIsDisable(disableType);
		setIsActionItemTypeModalOpen(true);
	};

	const handleActionItemType = () => {
		if (itemType === 'disable') {
			disableItemTypeApi(itemTypeId, () => {
			setCallApi(true);
			setIsActionItemTypeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteItemApi(itemTypeId, () => {
			setCallApi(true);
			setIsActionItemTypeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const rows = itemTypeList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{element.item_type_id}</Table.Td>
			<Table.Td>{element.item_type_id}</Table.Td>
			<Table.Td>{element.icon}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.item_type_id, 'disable', element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: '10px' }} onClick={() => handleOpenModal(element.item_type_id, 'delete', element.is_disabled)} />
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
				heading="Item Types"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: 'New Item Type',
					titleClassName: 'sm:flex hidden',
					className: 'rounded-md w-fit text-grey-100 text-sm',
					children: <Plus className="sm:mr-2 mr-0" size={20} />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>Item type Id</Table.Th>
						<Table.Th>Icon</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<ActionItemTypeModal
				isOpen={isActionItemTypeModalOpen}
				onClose={() => setIsActionItemTypeModalOpen(false)}
				setCallApi={setCallApi}
				handleActionItemType={handleActionItemType}
				itemType={itemType}
				isDisable={isDisable}
			/>

		</main>
	);
};

export default ItemTypesContainer;
