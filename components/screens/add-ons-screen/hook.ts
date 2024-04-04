import { sidebarStateAtom } from "@/atoms";
import { toggleBooleanState } from "@/utils";
import { useState } from "react";
import { useRecoilValue } from "recoil";

export const useAddOnsScreen = () => {
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
