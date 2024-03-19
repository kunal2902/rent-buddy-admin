import { atom } from "recoil";

export const openSubMenuAtom = atom<Array<string>>({
	key: "openSubMenuAtom",
	default: [],
});
