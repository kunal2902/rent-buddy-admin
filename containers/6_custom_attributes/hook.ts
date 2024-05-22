import { useState } from "react";
import { useRecoilValue } from "recoil";
import { sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useCustomAttributesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [
		isCreateCustomAttributeModalOpen,
		setIsCreateCustomAttributeModalOpen,
	] = useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateCustomAttributeModalOpen,
		toggleCreateCustomAttributeModalOpen: toggleBooleanState(
			setIsCreateCustomAttributeModalOpen
		),
	};
};
