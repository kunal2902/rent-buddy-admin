"use client";

import { useCustomAttributesScreen } from "./hook";
import { DashboardPageHeader } from "@/components/common";
import { CreateCustomAttributeModal } from "@/components/modals";
import { Plus } from "lucide-react";

const CustomAttributesScreen = () => {
	const {
		isSidebarOpen,
		isCreateCustomAttributeModalOpen,
		toggleCreateCustomAttributeModalOpen,
	} = useCustomAttributesScreen();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Custom Attributes"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Attribute",
					className: "rounded-md w-fit text-grey-100 text-sm",
					titleClassName: "sm:flex hidden",
					leftIconClassName: "sm:mr-2 mr-0",
					LeftIcon: Plus,
					leftIconSize: 20,
					onClick: toggleCreateCustomAttributeModalOpen,
				}}
			/>

			<CreateCustomAttributeModal
				isOpen={isCreateCustomAttributeModalOpen}
				onClose={toggleCreateCustomAttributeModalOpen}
			/>
		</main>
	);
};

export default CustomAttributesScreen;
