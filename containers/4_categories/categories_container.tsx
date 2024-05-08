'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardPageHeader } from '@/components';
import { useCategoriesContainer } from './hook';
import CreateCategoryModal from './add_category';
import {
	deleteCategoryByIdApi,
	getCategoryApi,
} from '@/utils';
import { category } from '@/models';

const CategoriesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCategoryModalOpen,
		toggleCreateCategoryModalOpen,
	} = useCategoriesContainer();

	const [categoryList, setCategoryList] = useState<category[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			const successCallback = (data: any) => {
				setCategoryList(data.tags);
				setCallApi(false);
			};

			const errorCallback = () => {
				console.log('Error occurred.');
				setCallApi(false);
			};

			const logoutCallback = () => {
				console.log('Logout.');
				setCallApi(false);
			};

			getCategoryApi(
				null,
				successCallback,
				errorCallback,
				logoutCallback
			);
		}
	}, [callApi]);

	const handleDeleteCategory = (id: number) => {
		const successCallback = (data: any) => {
			setCallApi(true);
		};

		const errorCallback = () => {
			console.log('Error occurred.');
			setCallApi(false);
		};

		const logoutCallback = () => {
			console.log('Logout.');
			setCallApi(false);
		};
		deleteCategoryByIdApi(
			null,
			successCallback,
			errorCallback,
			logoutCallback
		);
	};

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

			<CreateCategoryModal
				isOpen={isCreateCategoryModalOpen}
				onClose={toggleCreateCategoryModalOpen}
			/>
		</main>
	);
};

export default CategoriesContainer;
