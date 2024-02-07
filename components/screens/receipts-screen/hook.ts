import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useReceiptsScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
