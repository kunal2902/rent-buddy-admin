import { sidebarStateAtom } from "@/atoms";
import { toggleBooleanState } from "@/utils/toggle-boolean-state";
import { useState } from "react";
import { useRecoilValue } from "recoil";

export const useTagsScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateTagModalOpen, setIsCreateTagModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateTagModalOpen,
		toggleCreateModalTagOpen: toggleBooleanState(setIsCreateTagModalOpen),
	};
};
