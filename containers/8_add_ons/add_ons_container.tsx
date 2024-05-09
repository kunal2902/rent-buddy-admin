"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAddOnsContainer } from "./hook";
import { DashboardPageHeader } from "@/components";
import AddAddOnModal from "./add_add_on_modal";
import { AddOnModel } from "@/models";
import {
	deleteAddOnByIdApi,
	getAddOnApi,
} from "@/utils";

const AddOnsContainer = () => {
	const {
		isSidebarOpen,
		isCreateAddOnModalOpen,
		toggleCreateAddOnModalOpen,
	} = useAddOnsContainer();

	const [addOnList, setAddOnList] = useState<AddOnModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			const successCallback = (data: any) => {
				console.log("Success:", data);
				setAddOnList(data.tags);
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

			getAddOnApi(null, successCallback, errorCallback, logoutCallback);
		}
	}, [callApi]);

	const handleDeleteAddOn = (id: number) => {
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
		deleteAddOnByIdApi(
			null,
			successCallback,
			errorCallback,
			logoutCallback
		);
	};

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
					titleClassName: "sm:flex hidden",
					onClick: toggleCreateAddOnModalOpen,
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<AddAddOnModal
				isOpen={isCreateAddOnModalOpen}
				onClose={toggleCreateAddOnModalOpen}
			/>
		</main>
	);
};

export default AddOnsContainer;
