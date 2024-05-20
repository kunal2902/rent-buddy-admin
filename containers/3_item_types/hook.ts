import { useRecoilValue } from "recoil";
import { useState } from "react";
import { onTextInputChange, sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useItemTypesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateItemTypeModalOpen, setIsCreateItemTypeModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateItemTypeModalOpen,
		toggleCreateItemTypeModalOpen: toggleBooleanState(
			setIsCreateItemTypeModalOpen
		),
	};
};

export const useCreateItemTypeModal = () => {
	const [itemTypeName, setItemTypeName] = useState<string>("");

	return {
		itemTypeName,
		onItemTypeNameChange: onTextInputChange(setItemTypeName),
	};
};
