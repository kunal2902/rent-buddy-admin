import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useReportsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
