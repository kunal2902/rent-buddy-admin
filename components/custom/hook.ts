"use client";

import { usePathname } from "next/navigation";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	sidebarStateAtom,
	toggleBooleanState,
	openSubMenuAtom,
	getName,
} from "@/utils";

interface Args {
	subMenuId: number;
}

export const useSubMenuBlock = (args: Args) => {
	const { subMenuId } = args;

	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const currentPathname = usePathname();
	const [openSubMenus, setOpenSideMenus] =
		useRecoilState<Array<number>>(openSubMenuAtom);

	const isBlockOpen = useMemo(
		() => openSubMenus.includes(subMenuId),
		[openSubMenus, subMenuId],
	);

	const toggleBlockState = () => {
		if (isBlockOpen) {
			setOpenSideMenus((prev) =>
				prev.filter((item) => item !== subMenuId),
			);

			return;
		}

		setOpenSideMenus((prev) => [...prev, subMenuId]);
	};

	return {
		isSidebarOpen,
		currentPathname,
		isBlockOpen,
		toggleBlockState,
	};
};

export const useMainSidebar = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const currentPathname = usePathname();

	return {
		isSidebarOpen,
		currentPathname,
	};
};

export const useMainNavbar = () => {
	const setSidebarState = useSetRecoilState<boolean>(sidebarStateAtom);
	const [userName, setUserName] = useState<string>("");
	const isMounted = useRef<boolean>(false);

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
