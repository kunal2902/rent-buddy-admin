"use client";

import { ModalPageHeader } from "@/components/common";
import { X } from "lucide-react";
import { useCreateCategoryScreen } from "./hook";

const CreateCategoryScreen = () => {
	const { onBackClick } = useCreateCategoryScreen();

	return (
		<main className="w-full flex min-h-screen flex-col bg-light-background-natural">
			<ModalPageHeader
				leftButton
				leftButtonProps={{
					title: "",
					LeftIcon: X,
					className:
						"w-fit p-3 rounded-md bg-grey-300 hover:bg-grey-400",
					onClick: onBackClick,
					leftIconSize: 20,
				}}
				rightButton
				rightButtonProps={{
					title: "Save",
					className:
						"w-fit px-4 py-3 rounded-md bg-primary-main hover:bg-primary-dark mt-0",
				}}
				className="pt-4 px-6 items-center"
			/>
		</main>
	);
};

export default CreateCategoryScreen;
