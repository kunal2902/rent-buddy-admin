import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useSettingsScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
