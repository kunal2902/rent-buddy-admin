"use client";

import { Plus } from "lucide-react";
import { useAddOnsScreen } from "./hook";
import { DashboardPageHeader } from "@/components/common";
import { CreateAddOnModal } from "@/components/modals";

const AddOnsScreen = () => {
	const {
		isSidebarOpen,
		isCreateAddOnModalOpen,
		toggleCreateAddOnModalOpen,
	} = useAddOnsScreen();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Add Ons"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Add On",
					className: "rounded-md w-fit text-grey-100 text-sm",
					titleClassName: "sm:flex hidden",
					leftIconClassName: "sm:mr-2 mr-0",
					LeftIcon: Plus,
					leftIconSize: 20,
					onClick: toggleCreateAddOnModalOpen,
				}}
			/>

			<CreateAddOnModal
				isOpen={isCreateAddOnModalOpen}
				onClose={toggleCreateAddOnModalOpen}
			/>
		</main>
	);
};

export default AddOnsScreen;
