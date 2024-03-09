import { sidebarStateAtom } from "@/atoms";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";

export const useInventorySidebar = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const currentPathname = usePathname();

	return {
		isSidebarOpen,
		currentPathname,
	};
};
