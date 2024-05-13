'use client';

import { Plus } from 'lucide-react';
import { TableData } from '@mantine/core/lib/components';
import { useEffect, useState } from 'react';
import { useTagsContainer } from './hook';
import { DashboardPageHeader, TableComponent } from '@/components';
import AddTagModal from './add_tag_modal';
import { TagModel } from '@/models';
import { deleteTagApi, getTagApi } from '@/utils';

const TagsContainer = () => {
	const { isSidebarOpen, isCreateTagModalOpen, toggleCreateModalTagOpen } =
		useTagsContainer();

	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			getTagApi((data: any) => {
				setTagsList(data.tags);
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

	const handleDeleteTag = (id: string) => {
		deleteTagApi(id, () => {
			setCallApi(true);
		}, () => {
			console.log('Error occurred.');
			setCallApi(false);
		}, () => {
			console.log('Logout.');
			setCallApi(false);
		});
	};

	const tableData: TableData = {
		caption: 'Some elements from periodic table',
		head: ['Element position', 'Atomic mass', 'Symbol', 'Element name'],
		body: [
			[6, 12.011, 'C', 'Carbon'],
			[7, 14.007, 'N', 'Nitrogen'],
			[39, 88.906, 'Y', 'Yttrium'],
			[56, 137.33, 'Ba', 'Barium'],
			[58, 140.12, 'Ce', 'Cerium'],
		],
	};

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? 'lg:pl-64 pl-0' : 'pl-16'
			}`}
		>
			<DashboardPageHeader
				heading="Tags"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: 'New Tag',
					titleClassName: 'sm:flex hidden',
					onClick: toggleCreateModalTagOpen,
					className: 'rounded-md w-fit text-grey-100 text-sm',
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<TableComponent
				mx={10}
				p={4}
				data={tableData}
			/>

			<AddTagModal
				isOpen={isCreateTagModalOpen}
				onClose={toggleCreateModalTagOpen}
			/>
		</main>
	);
};

export default TagsContainer;
