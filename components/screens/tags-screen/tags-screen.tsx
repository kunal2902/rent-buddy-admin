"use client";

import { useTagsScreen } from "./hook";
import { DashboardPageHeader } from "@/components/common";
import { TableComponent } from "@/components/common/table";
import { TableColumn, TableRow } from "@/components/common/table/table";
import { CreateTagModal } from "@/components/modals";
import { Plus } from "lucide-react";

const TagsScreen = () => {
	const { isSidebarOpen, isCreateTagModalOpen, toggleCreateModalTagOpen } =
		useTagsScreen();

	const rows: TableRow[] = [
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
	];

	const columns: TableColumn[][] = [
		[
			{
				content: "INV001",
			},
			{
				content: "Paid",
			},
			{
				content: "Credit Card",
			},
			{
				content: "$250.00",
			},
		],
	];

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
					className: "rounded-md w-fit text-grey-100 text-sm",
					titleClassName: "sm:flex hidden",
					leftIconClassName: "sm:mr-2 mr-0",
					LeftIcon: Plus,
					leftIconSize: 20,
					onClick: toggleCreateModalTagOpen,
				}}
			/>

			<div className="box mx-10 p-4">
				<TableComponent
					rows={rows}
					columns={columns}
					caption="A list of your recent invoices."
				/>
			</div>

			<CreateTagModal
				isOpen={isCreateTagModalOpen}
				onClose={toggleCreateModalTagOpen}
			/>
		</main>
	);
};

export default TagsScreen;
