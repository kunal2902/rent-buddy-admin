import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import {
	onTextInputChange,
	sidebarStateAtom,
	toggleBooleanState,
} from "@/utils";

export const useSubCategoriesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateSubCategoryModalOpen, setIsCreateSubCategoryModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateSubCategoryModalOpen,
		toggleCreateSubCategoryModalOpen: toggleBooleanState(
			setIsCreateSubCategoryModalOpen,
		),
	};
};

export const useCreateSubCategoryModal = () => {
	const [subCategoryName, setSubCategoryName] = useState<string>("");
	const fileInputRef = useRef<HTMLButtonElement>(null);

	return {
		subCategoryName,
		onSubCategoryNameChange: onTextInputChange(setSubCategoryName),
		fileInputRef,
	};
};
