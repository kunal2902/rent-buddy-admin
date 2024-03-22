import { sidebarStateAtom } from "@/atoms";
import { toggleBooleanState } from "@/utils/toggle-boolean-state";
import { useState } from "react";
import { useRecoilValue } from "recoil";

export const useCustomersScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return {
		isSidebarOpen,
		isModalOpen,
		toggleModalState: toggleBooleanState(setIsModalOpen),
	};
};
