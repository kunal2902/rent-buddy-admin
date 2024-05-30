"use client";

import { useSetRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { getName, sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useMainNavbar = () => {
	const isMounted = useRef<boolean>(false);
	const setSidebarState = useSetRecoilState<boolean>(sidebarStateAtom);
	const [userName, setUserName] = useState<string>("");

	useEffect(() => {
		if (isMounted.current) return;

		isMounted.current = true;
		const name = getName();

		if (name && name.charAt(0)) {
			setUserName(name.charAt(0));
		}
	}, []);

	return {
		toggleSidebar: toggleBooleanState(setSidebarState),
		userName,
	};
};
