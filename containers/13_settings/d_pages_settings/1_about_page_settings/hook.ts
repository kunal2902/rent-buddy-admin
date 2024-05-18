import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useAboutPageContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
