import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useCustomersContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
