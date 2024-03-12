import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useEmailScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
