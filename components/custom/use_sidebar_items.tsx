"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getCookie } from "cookies-next";
import { activityLogsName, isAdminAtom, settingsName, usersName } from "@/utils";
import { SidebarItems, SideBarProps, SideBarType } from "@/constants";

export const useSidebarItems = (): Array<SideBarProps<SideBarType>> => {
	const [isAdmin, setIsAdmin] = useRecoilState(isAdminAtom);
	const [sidebarItems, setSidebarItems] = useState<SideBarProps<SideBarType>[] | null>(null);

	useEffect(() => {
		const cookieValue = getCookie("is_admin");
		if (cookieValue) {
			setIsAdmin(JSON.parse(cookieValue as string));
		}
	}, [setIsAdmin]);

	useEffect(() => {
		if (isAdmin === null) return;

		const items = SidebarItems.filter((item) =>
			!(!isAdmin && [usersName, activityLogsName, settingsName].includes(item.title)));

		console.log(items);

		setSidebarItems(items);
	}, [isAdmin]);

	return sidebarItems ?? [];
};
