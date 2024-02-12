import { sidebarStateAtom } from "@/atoms";
import { toggleBooleanState } from "@/utils/toggle-boolean-state";
import { useSetRecoilState } from "recoil";

export const useMainNavbar = () => {
	const setSidebarState = useSetRecoilState<boolean>(sidebarStateAtom);

	return {
		toggleSidebar: toggleBooleanState(setSidebarState),
	};
};
