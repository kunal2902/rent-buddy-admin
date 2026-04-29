"use client";

import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { getName, sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useMainNavbar = () => {
	const [isSidebarOpen, setSidebarOpen] = useRecoilState<boolean>(sidebarStateAtom);

	const toggleSidebar = () => setSidebarOpen((v) => !v);

	return {
		isSidebarOpen,
		toggleSidebar,
	};
};
