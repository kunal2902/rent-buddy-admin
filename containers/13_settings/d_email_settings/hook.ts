import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useEmailSettingsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
