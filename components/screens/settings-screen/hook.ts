import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useSettingScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
