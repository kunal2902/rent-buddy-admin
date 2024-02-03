import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useMainSidebar = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
