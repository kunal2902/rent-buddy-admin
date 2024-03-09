import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useCategoriesScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
