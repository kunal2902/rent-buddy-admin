"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useCustomAttributesContainer } from "./hook";
import { DashboardPageHeader } from "@/components";
import AddCustomAttributeModal from "./add_custom_attribute";
import { CustomAttributeModel } from "@/models";
import {
	deleteAttributebyIdApi,
	getAttributeApi,
} from "@/utils";

const CustomAttributesContainer = () => {
	const {
		isSidebarOpen,
		isCreateCustomAttributeModalOpen,
		toggleCreateCustomAttributeModalOpen,
	} = useCustomAttributesContainer();

	const [customAttributesList, setCustomAttributesList] =
		useState<CustomAttributeModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			const successCallback = (data: any) => {
				console.log("Success:", data);
				setCustomAttributesList(data.tags);
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

			getAttributeApi(
				null,
				successCallback,
				errorCallback,
				logoutCallback
			);
		}
	}, [callApi]);

	const handleDeleteAttribute = (id: number) => {
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
		deleteAttributebyIdApi(
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
				heading="Custom Attributes"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Attribute",
					titleClassName: "sm:flex hidden",
					onClick: toggleCreateCustomAttributeModalOpen,
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<AddCustomAttributeModal
				isOpen={isCreateCustomAttributeModalOpen}
				onClose={toggleCreateCustomAttributeModalOpen}
			/>
		</main>
	);
};

export default CustomAttributesContainer;
