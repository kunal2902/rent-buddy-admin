"use client";

import { useRecoilValue } from "recoil";
import { sidebarStateAtom } from "@/utils/atom_utils";

export const useSidebarState = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
