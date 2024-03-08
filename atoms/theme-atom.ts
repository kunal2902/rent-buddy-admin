import { Theme } from "@/types/common";
import { atom } from "recoil";

export const themeAtom = atom<Theme>({
	key: "themeAtom",
	default: "light",
});
