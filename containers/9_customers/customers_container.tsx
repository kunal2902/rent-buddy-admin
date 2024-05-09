"use client";

import { TableData } from "@mantine/core/lib/components";
import { DashboardPageHeader, TableComponent } from "@/components";
import { useCustomersContainer } from "./hook";

const CustomersContainer = () => {
	const { isSidebarOpen } = useCustomersContainer();

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
				heading="Customers"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
			/>

			<TableComponent
				mx={10}
				p={4}
				data={tableData}
			/>
		</main>
	);
};

export default CustomersContainer;
