import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useItemsScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
