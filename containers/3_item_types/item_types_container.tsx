'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useItemTypesContainer } from './hook';
import { DashboardPageHeader } from '@/components';
import { ItemTypeModel } from '@/models';
import { deleteItemTypeApi, getItemTypeApi } from '@/utils';

const ItemTypesContainer = () => {
	const { isSidebarOpen } = useItemTypesContainer();
	const [itemTypeList, setItemTypeList] = useState<ItemTypeModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			getItemTypeApi((data: any) => {
				setItemTypeList(data);
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

	const handleDeleteItemType = (id: string) => {
		deleteItemTypeApi(id, () => {
			setCallApi(true);
		}, () => {
			console.log('Error occurred.');
			setCallApi(false);
		}, () => {
			console.log('Logout.');
			setCallApi(false);
		});
	};

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
		</main>
	);
};

export default ItemTypesContainer;
