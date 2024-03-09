import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useItemTypesScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
