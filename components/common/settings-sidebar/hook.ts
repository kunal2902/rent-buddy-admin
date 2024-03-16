import { sidebarStateAtom } from "@/atoms";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";

export const useSettingSidebar = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const currentPathname = usePathname();

	return {
		isSidebarOpen,
		currentPathname,
	};
};
