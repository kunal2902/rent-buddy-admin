import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils";

export const useUsersContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
