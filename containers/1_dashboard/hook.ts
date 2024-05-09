import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useDashboardContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
