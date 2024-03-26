import { sidebarStateAtom } from "@/atoms";
import { toggleBooleanState } from "@/utils";
import { useState } from "react";
import { useRecoilValue } from "recoil";

export const useCustomAttributesScreen = () => {
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
