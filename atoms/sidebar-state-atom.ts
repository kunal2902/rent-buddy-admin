import { atom } from "recoil";

export const sidebarStateAtom = atom<boolean>({
	key: "sidebarStateAtom",
	default: false,
});
