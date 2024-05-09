"use client";

import { Plus } from "lucide-react";
import { TableData } from "@mantine/core/lib/components";
import { useEffect, useState } from "react";
import { useTagsContainer } from "./hook";
import { DashboardPageHeader, TableComponent } from "@/components";
import AddTagModal from "./add_tag_modal";
import { TagModel } from "@/models";
import { deleteTagByIdApi, getTagApi } from "@/utils";

const TagsContainer = () => {
	const { isSidebarOpen, isCreateTagModalOpen, toggleCreateModalTagOpen } =
		useTagsContainer();

	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			const successCallback = (data: any) => {
				console.log("Success:", data);
				setTagsList(data.tags);
				setCallApi(false);
			};

			const errorCallback = () => {
				console.log("Error occurred.");
				setCallApi(false);
			};

			const logoutCallback = () => {
				console.log("Logout.");
				setCallApi(false);
			};

			getTagApi(null, successCallback, errorCallback, logoutCallback).then();
		}
	}, [callApi]);

	const handleDeleteTag = (id: number) => {
		const successCallback = (data: any) => {
			setCallApi(true);
		};

		const errorCallback = () => {
			console.log("Error occurred.");
			setCallApi(false);
		};

		const logoutCallback = () => {
			console.log("Logout.");
			setCallApi(false);
		};
		deleteTagByIdApi(null, successCallback, errorCallback, logoutCallback);
	};

	const rows = [
		{
			title: "Name",
		},
		{
			title: "Icon",
		},
		{
			title: "Is disabled",
		},
		{
			title: "Is deleted",
		},
		{
			title: "Action",
		},
	];

	const columns = tagsList.map((item) => [
		{ content: item.tag_id },
		{ content: item.name },
		{ content: item.created_by_id },
		{ content: new Date(item.created_at).toLocaleString() }, // Format date if needed
		{ content: item.is_disabled ? "Yes" : "No" },
		{ content: item.is_deleted ? "Yes" : "No" },
		{ content: "Delete" },
	]);

	const tableData: TableData = {
		caption: "Some elements from periodic table",
		head: ["Element position", "Atomic mass", "Symbol", "Element name"],
		body: [
			[6, 12.011, "C", "Carbon"],
			[7, 14.007, "N", "Nitrogen"],
			[39, 88.906, "Y", "Yttrium"],
			[56, 137.33, "Ba", "Barium"],
			[58, 140.12, "Ce", "Cerium"],
		],
	};

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Tags"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Tag",
					titleClassName: "sm:flex hidden",
					onClick: toggleCreateModalTagOpen,
					className: "rounded-md w-fit text-grey-100 text-sm",
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
