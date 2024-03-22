"use client";

import { DashboardPageHeader } from "@/components/common";
import { useCustomersScreen } from "./hook";
import { TableComponent } from "@/components/common/table";
import { TableColumn, TableRow } from "@/components/common/table/table";
import { Modal } from "@/components/common/modal";
import { Plus } from "lucide-react";

const CustomersScreen = () => {
	const { isSidebarOpen, isModalOpen, toggleModalState } =
		useCustomersScreen();

	const rows: TableRow[] = [
		{
			title: "Invoice",
		},
		{
			title: "Status",
		},
		{
			title: "Method",
		},
		{
			title: "Amount",
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
				heading="Customers"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "Add Customer",
					LeftIcon: Plus,
					onClick: toggleModalState,
				}}
			/>
			<div className="box mx-10 p-4">
				<TableComponent
					rows={rows}
					columns={columns}
					caption="A list of your recent invoices."
				/>
			</div>
			<Modal
				className="flex flex-col"
				isOpen={isModalOpen}
				onClose={toggleModalState}
			>
				<h1 className="text-lg font-public-sans">Hello there!!</h1>
			</Modal>
		</main>
	);
};

export default CustomersScreen;
