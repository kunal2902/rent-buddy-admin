"use client";

import { atom } from "recoil";
import { getCookie, setCookie } from "cookies-next";
import { Theme } from "@/types";
import { CartItemModel, CartModel } from "@/models";
import { isAdminConstant } from "@/utils/config";

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

export const cartItemsAtom = atom<Array<CartItemModel>>({
	default: [],
	key: "cartItemsAtom",
});

export const cartAtom = atom<CartModel | null>({
	default: null,
	key: "cartAtom",
});

export const cartPaymentMethodAtom = atom<string>({
	key: "paymentMethod",
	default: "",
});

export const isAdminAtom = atom<boolean>({
	key: "isAdmin",
	default: false,
});

export const permissionEntitiesAtom = atom({
	key: "permissionEntities",
	default: [],
});
