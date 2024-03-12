import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const usePageScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
