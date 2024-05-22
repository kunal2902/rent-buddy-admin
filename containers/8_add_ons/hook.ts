import { useState } from "react";
import { useRecoilValue } from "recoil";
import { sidebarStateAtom, toggleBooleanState } from "@/utils";

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
