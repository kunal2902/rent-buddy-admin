import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const usePageLayoutScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
