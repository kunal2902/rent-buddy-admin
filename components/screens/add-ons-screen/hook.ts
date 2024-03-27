import { sidebarStateAtom } from "@/atoms";
// import { toggleBooleanState } from "@/utils";
// import { useState } from "react";
import { useRecoilValue } from "recoil";

export const useAddOnsScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	// const [isCreateCategoryModalOpen, setIsCategoryModalOpen] =
	// 	useState<boolean>(false);

	return {
		isSidebarOpen,
		// isCreateCategoryModalOpen,
		// toggleCreateCategoryModalOpen: toggleBooleanState(
		// 	setIsCategoryModalOpen
		// ),
	};
};
