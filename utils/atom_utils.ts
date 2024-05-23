"use client";

import { atom } from "recoil";
import { Theme } from "@/types";

export const sidebarStateAtom = atom<boolean>({
	key: "sidebarStateAtom",
	default: false,
});

export const openSubMenuAtom = atom<Array<number>>({
	key: "openSubMenuAtom",
	default: [],
});

export const themeAtom = atom<Theme>({
	key: "themeAtom",
	default: "light",
});
