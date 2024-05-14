'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardPageHeader } from '@/components';
import { useCategoriesContainer } from './hook';
import CreateCategoryModal from './add_category';
import { CategoryModel } from '@/models';
import { deleteCategoryApi, getCategoryApi } from '@/utils';

const CategoriesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCategoryModalOpen,
		toggleCreateCategoryModalOpen,
	} = useCategoriesContainer();

	const [categoryList, setCategoryList] = useState<CategoryModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			getCategoryApi((data: any) => {
				setCategoryList(data);
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
