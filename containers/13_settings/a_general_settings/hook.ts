import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useGeneralSettingsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
