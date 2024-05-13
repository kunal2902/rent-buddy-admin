'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAddOnsContainer } from './hook';
import { DashboardPageHeader } from '@/components';
import AddAddOnModal from './add_add_on_modal';
import { AddOnModel } from '@/models';
import { deleteAddOnApi, getAddOnApi } from '@/utils';

const AddOnsContainer = () => {
	const {
		isSidebarOpen,
		isCreateAddOnModalOpen,
		toggleCreateAddOnModalOpen,
	} = useAddOnsContainer();

	const [addOnList, setAddOnList] = useState<AddOnModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			getAddOnApi((data: any) => {
				setAddOnList(data);
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

	const handleDeleteAddOn = (id: string) => {
		deleteAddOnApi(id, () => {
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
				heading="Add Ons"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: 'New Add On',
					titleClassName: 'sm:flex hidden',
					onClick: toggleCreateAddOnModalOpen,
					className: 'rounded-md w-fit text-grey-100 text-sm',
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<AddAddOnModal
				isOpen={isCreateAddOnModalOpen}
				onClose={toggleCreateAddOnModalOpen}
			/>
		</main>
	);
};

export default AddOnsContainer;
