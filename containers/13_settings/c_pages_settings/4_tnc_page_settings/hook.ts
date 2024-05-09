import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useTnCPageContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
