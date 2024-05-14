'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { Switch, Table } from '@mantine/core';
import { DashboardPageHeader } from '@/components';
import { useCategoriesContainer } from './hook';
import CreateCategoryModal from './add_category';
import { category } from '@/models';
import { deleteCategoryApi, disableCategoryApi, getCategoryApi } from '@/utils';
import ActionCategoryModal from './action_category_modal';

const CategoriesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCategoryModalOpen,
		toggleCreateCategoryModalOpen,
	} = useCategoriesContainer();

	const [categoryList, setCategoryList] = useState<category[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [catId, setCatId] = useState<string>('');
	const [catType, setCatType] = useState<string>('');
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionCatModalOpen, setIsActionCatModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getCategoryApi((data: any) => {
				setCategoryList(data.categories);
				setCallApi(false);
			}, () => {
				console.log('Error occurred.');
				setCallApi(false);
			}, () => {
				console.log('Logout.');
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleDeleteCategory = (id: string) => {
		deleteCategoryApi(id, () => {
			setCallApi(true);
		}, () => {
			console.log('Error occurred.');
			setCallApi(false);
		}, () => {
			console.log('Logout.');
			setCallApi(false);
		});
	};

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setCatId(id);
		setCatType(type);
		setIsDisable(disableType);
		setIsActionCatModalOpen(true);
	};

	const handleActionCat = () => {
		if (catType === 'disable') {
			disableCategoryApi(catId, () => {
			setCallApi(true);
			setIsActionCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteCategoryApi(catId, () => {
			setCallApi(true);
			setIsActionCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const rows = categoryList.map((element) => (
		<Table.Tr>
			{/* <Table.Td>{element.category_id}</Table.Td> */}
			<Table.Td>{element.category_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.category_id, 'disable', element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: '10px' }} onClick={() => handleOpenModal(element.category_id, 'delete', element.is_disabled)} />
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
				heading="Categories"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: 'New Category',
					titleClassName: 'sm:flex hidden',
					onClick: toggleCreateCategoryModalOpen,
					className: 'rounded-md w-fit text-grey-100 text-sm',
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						{/* <Tablec.Th>Sr No.</Table.Th> */}
						<Table.Th>Category Id</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<CreateCategoryModal
				isOpen={isCreateCategoryModalOpen}
				onClose={toggleCreateCategoryModalOpen}
			/>

			<ActionCategoryModal
				isOpen={isActionCatModalOpen}
				onClose={() => setIsActionCatModalOpen(false)}
				setCallApi={setCallApi}
				handleActionCat={handleActionCat}
				catType={catType}
				isDisable={isDisable}
			/>
		</main>
	);
};

export default CategoriesContainer;
