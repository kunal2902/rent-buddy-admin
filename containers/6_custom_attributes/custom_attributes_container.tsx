'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCustomAttributesContainer } from './hook';
import { DashboardPageHeader } from '@/components';
import AddCustomAttributeModal from './add_custom_attribute';
import { CustomAttributeModel } from '@/models';
import { deleteAttributeApi, getAttributeApi } from '@/utils';

const CustomAttributesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCustomAttributeModalOpen,
		toggleCreateCustomAttributeModalOpen,
	} = useCustomAttributesContainer();

	const [customAttributesList, setCustomAttributesList] =
		useState<CustomAttributeModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			getAttributeApi((data: any) => {
				setCustomAttributesList(data);
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

	const handleDeleteAttribute = (id: string) => {
		deleteAttributeApi(id, () => {
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

			<AddCustomAttributeModal
				isOpen={isCreateCustomAttributeModalOpen}
				onClose={toggleCreateCustomAttributeModalOpen}
			/>
		</main>
	);
};

export default CustomAttributesContainer;
