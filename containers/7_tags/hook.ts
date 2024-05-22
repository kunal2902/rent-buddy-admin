import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
	sidebarStateAtom,
	toggleBooleanState,
} from "@/utils";

export const useTagsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateTagModalOpen, setIsCreateTagModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateTagModalOpen,
		toggleCreateModalTagOpen: toggleBooleanState(setIsCreateTagModalOpen),
	};
};
