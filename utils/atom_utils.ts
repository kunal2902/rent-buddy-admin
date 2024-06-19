"use client";

import { atom } from "recoil";
import { Theme } from "@/types";
import { CartItemModel, CartModel } from "@/models";

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

export const posCart = atom<any>({
	key: "posCart",
	default: [],
});

export const customerAtom = atom<any>({
	key: "customerAtom",
	default: { id: "", name: "" },
});

export const cartIdAtom = atom<string>({
	key: "cartId",
	default: "",
});

export const callCartApiAtom = atom<boolean>({
	key: "callCartApi",
	default: false,
});

export const cartItemsAtom = atom<Array<CartItemModel>>({
	default: [],
	key: "cartAtom",
});
export const cartAtom = atom<CartModel | null>({
	default: null,
	key: "cartAtom",
});
