import { useState } from "react";
import { useRecoilValue } from "recoil";
import { onTextInputChange, sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useAddOnsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateAddOnModalOpen, setIsCreateAddOnModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateAddOnModalOpen,
		toggleCreateAddOnModalOpen: toggleBooleanState(
			setIsCreateAddOnModalOpen
		),
	};
};

export const useCreateAddOnModal = () => {
	const [addOnName, setAddOnName] = useState<string>("");
	const [addOnPrice, setAddOnPrice] = useState<string>("");

	return {
		addOnName,
		onAddOnNameChange: onTextInputChange(setAddOnName),
		addOnPrice,
		onAddOnPriceChange: onTextInputChange(setAddOnPrice),
	};
};
