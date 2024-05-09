"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components";
import { useItemsContainer } from "./hook";
import {
	deleteItemTypeByIdApi,
	getItemTypeApi,
} from "@/utils";
import { ItemTypeModel } from "@/models";

const ItemsContainer = () => {
	const { isSidebarOpen } = useItemsContainer();
	const [itemList, setItemList] = useState<ItemTypeModel[]>([]);
	const [callApi, setCallApi] = useState(true);

	useEffect(() => {
		if (callApi) {
			const successCallback = (data: any) => {
				console.log("Success:", data);
				setItemList(data.tags);
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

			getItemTypeApi(
				null,
				successCallback,
				errorCallback,
				logoutCallback
			);
		}
	}, [callApi]);

	const handleDeleteItem = (id: number) => {
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
		deleteItemTypeByIdApi(
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
				heading="Items"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Item",
					titleClassName: "sm:flex hidden",
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus className="sm:mr-2 mr-0" size={20} />,
				}}
			/>
		</main>
	);
};

export default ItemsContainer;
