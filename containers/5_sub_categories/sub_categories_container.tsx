'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSubCategoriesContainer } from './hook';
import { DashboardPageHeader } from '@/components';
import { SubCategoryModel } from '@/models';
import {
	deleteSubCategoryByIdApi,
	getSubCategoryApi,
} from '@/utils';

const SubCategoriesContainer = () => {
	const { isSidebarOpen } = useSubCategoriesContainer();

	const [subCategoryList, setSubCategoryList] = useState<SubCategoryModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			const successCallback = (data: any) => {
				console.log('Success:', data);
				setSubCategoryList(data.tags);
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

			getSubCategoryApi(
				null,
				successCallback,
				errorCallback,
				logoutCallback
			);
		}
	}, [callApi]);

	const handleDeleteSubCategory = (id: number) => {
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
		deleteSubCategoryByIdApi(
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
				heading="Sub Categories"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: 'New Sub Category',
					titleClassName: 'sm:flex hidden',
					className: 'rounded-md w-fit text-grey-100 text-sm',
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>
		</main>
	);
};

export default SubCategoriesContainer;
