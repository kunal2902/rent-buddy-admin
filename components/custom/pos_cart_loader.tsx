"use client";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { CartItemModel, CartModel } from "@/models";
import { cartAtom, cartItemsAtom } from "@/utils";

// TODO: extract all these components into container components as these are not the reusable ones

export const PosCartLoader = () => {
	const setCart = useSetRecoilState<CartModel | null>(cartAtom);
	const setCartItems = useSetRecoilState<Array<CartItemModel>>(cartItemsAtom);
	const isAppMounted = useRef<boolean>(false);

	useEffect(() => {
		if (isAppMounted.current) return;

		isAppMounted.current = true;
		setCart(null);
		setCartItems([]);
	}, []);

	return <></>;
};
