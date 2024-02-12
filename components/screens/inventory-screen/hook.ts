import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useInventoryScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
