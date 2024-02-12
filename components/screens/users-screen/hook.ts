import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const useUsersScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
