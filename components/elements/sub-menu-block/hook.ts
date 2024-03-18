import { sidebarStateAtom } from "@/atoms";
import { toggleBooleanState } from "@/utils/toggle-boolean-state";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";

export const useSubMenuBlock = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const currentPathname = usePathname();
	const [isBlockOpen, setIsBlockOpen] = useState<boolean>(false);

	return {
		isSidebarOpen,
		currentPathname,
		isBlockOpen,
		toggleBlockState: toggleBooleanState(setIsBlockOpen),
	};
};
