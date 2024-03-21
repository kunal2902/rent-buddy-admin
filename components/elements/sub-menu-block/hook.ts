import { openSubMenuAtom, sidebarStateAtom } from "@/atoms";
// import { toggleBooleanState } from "@/utils/toggle-boolean-state";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

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
		[openSubMenus, subMenuId]
	);

	const toggleBlockState = () => {
		if (isBlockOpen) {
			setOpenSideMenus((prev) =>
				prev.filter((item) => item !== subMenuId)
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
