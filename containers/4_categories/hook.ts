import { useState } from "react";
import { useRecoilValue } from "recoil";
import { onTextInputChange, sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useCategoriesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateCategoryModalOpen, setIsCategoryModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateCategoryModalOpen,
		toggleCreateCategoryModalOpen: toggleBooleanState(
			setIsCategoryModalOpen
		),
	};
};

export const useCreateCategoryModal = () => {
	const [categoryName, setCategoryName] = useState<string>("");

	return {
		categoryName,
		onCategoryNameChange: onTextInputChange(setCategoryName),
	};
};
