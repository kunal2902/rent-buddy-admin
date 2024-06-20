"use client";

import { useRecoilState, useSetRecoilState } from "recoil";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NumberInputHandlers } from "@mantine/core";
import { CartItemModel, CartModel, ItemModel } from "@/models";
import {
	cartAtom,
	cartItemsAtom,
	currencySign,
	deleteCartItemApi,
	logoutUser,
	upsertCartApi,
	upsertCartItemApi,
} from "@/utils";
import {
	ButtonComponent,
	CardComponent,
	CardSectionComponent,
	GroupComponent,
	ImageComponent,
	MantineProviderComponent,
	NumberInputComponent,
	SpoilerComponent,
	TextComponent,
} from "../mantine";
import { centeredInputTheme } from "@/constants";

interface Props {
	cartItem: CartItemModel | undefined;
	item: ItemModel;
	isAddToCartApiBusy: boolean;
	toggleIsAddToCartApiBusy: (newState?: boolean) => void;
	addSubCartItem: string | null;
	setAddSubCartItem: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ProductCard = (props: Props) => {
	const {
		cartItem,
		item,
		isAddToCartApiBusy,
		toggleIsAddToCartApiBusy,
		addSubCartItem,
		setAddSubCartItem,
	} = props;

	const router = useRouter();
	const numberInputRef = useRef<NumberInputHandlers>(null);
	const [quantity, setQuantity] = useState<number>(
		cartItem ? cartItem.quantity : 0,
	);
	// const custId = useRecoilValue(customerAtom);
	// const setCallCart = useSetRecoilState(callCartApiAtom);
	const [cart, setCart] = useRecoilState<CartModel | null>(cartAtom);
	const setCartItems = useSetRecoilState<Array<CartItemModel>>(cartItemsAtom);
	const [sendDebouncedCall, setSendDebouncedCall] = useState<boolean>(false);

	useEffect(() => {
		if (sendDebouncedCall) {
			(async () => {
				await updateCartItemQuantity();
				setSendDebouncedCall(false);
			})();
		}
	}, [sendDebouncedCall]);

	useEffect(() => {
		if (cartItem) {
			setQuantity(cartItem.quantity);
		}
	}, [cartItem]);

	const onAddClick = async () => {
		if (isAddToCartApiBusy) return;

		toggleIsAddToCartApiBusy(true);

		try {
			let prevCart: CartModel | null = cart;

			if (!prevCart) {
				const cartCreationResponse = await upsertCartApi(
					{},
					() => {},
					() => {},
					() => {
						logoutUser(router);
					},
				);

				if (
					cartCreationResponse &&
					typeof cartCreationResponse !== "string"
				) {
					setCart(cartCreationResponse.cart);
					prevCart = cartCreationResponse.cart;
				}
			}

			console.log("prevCart", prevCart);

			const cartItemCreated = await upsertCartItemApi(
				{
					item_id: item.item_id,
					cart_id: cart ? cart.cart_id : prevCart?.cart_id,
					quantity: 1,
				},
				() => {},
				() => {},
				() => {
					logoutUser(router);
				},
			);

			toggleIsAddToCartApiBusy(false);

			if (cartItemCreated && typeof cartItemCreated !== "string") {
				setCartItems((prev) => [...prev, cartItemCreated.cartItem]);
				setQuantity(cartItemCreated.cartItem.quantity);
			}
		} catch (error) {
			toggleIsAddToCartApiBusy(false);

			if (error instanceof Error) {
				console.log(error.message);
			}
		}
	};

	const handleSubtractButtonClick = () => {
		if (
			isAddToCartApiBusy &&
			addSubCartItem !== null &&
			addSubCartItem !== cartItem?.cart_item_id
		) {
			return;
		}

		if (!isAddToCartApiBusy && addSubCartItem === null) {
			toggleIsAddToCartApiBusy(true);
			setAddSubCartItem(cartItem?.cart_item_id ?? null);
			setQuantity((prev) => prev - 1);
			setTimeout(async () => {
				setSendDebouncedCall(true);
				setAddSubCartItem(null);
			}, 500);

			return;
		}

		setQuantity((prev) => prev - 1);
	};

	const handleAddButtonClick = () => {
		if (
			isAddToCartApiBusy &&
			addSubCartItem !== null &&
			addSubCartItem !== cartItem?.cart_item_id
		) {
			return;
		}

		if (!isAddToCartApiBusy && addSubCartItem === null) {
			toggleIsAddToCartApiBusy(true);
			setAddSubCartItem(cartItem?.cart_item_id ?? null);
			setQuantity((prev) => prev + 1);
			setTimeout(async () => {
				setSendDebouncedCall(true);
				setAddSubCartItem(null);
			}, 500);

			return;
		}

		setQuantity((prev) => prev + 1);
	};

	const onQuantityTypingEnd = async () => {
		if (cartItem?.quantity === quantity) return;

		if (isAddToCartApiBusy) return;

		toggleIsAddToCartApiBusy(true);

		await updateCartItemQuantity();
	};

	const updateCartItemQuantity = async () => {
		try {
			console.log(quantity);

			if (Number(quantity) < 1) {
				await deleteCartItemApi(
					cartItem?.cart_item_id ?? "",
					() => {},
					() => {},
					() => {
						logoutUser(router);
					},
				);

				setCartItems((prev) =>
					prev.filter(
						(prevItem) =>
							prevItem.cart_item_id !== cartItem?.cart_item_id,
					),
				);
			} else {
				const updatedCartItem = await upsertCartItemApi(
					{
						id: cartItem ? cartItem.cart_item_id : undefined,
						item_id: item.item_id,
						cart_id: cart ? cart.cart_id : undefined,
						quantity,
					},
					() => {},
					() => {},
					() => {
						logoutUser(router);
					},
				);

				console.log(updatedCartItem);

				if (updatedCartItem && typeof updatedCartItem !== "string") {
					setCartItems((prev) => {
						const newItems = prev.map((prevItem) => {
							if (
								prevItem.cart_item_id ===
								updatedCartItem.cartItem.cart_item_id
							) {
								return updatedCartItem.cartItem;
							}

							return prevItem;
						});

						return newItems;
					});
				}
			}

			toggleIsAddToCartApiBusy(false);
			setAddSubCartItem(null);
		} catch (error) {
			toggleIsAddToCartApiBusy(false);
			setAddSubCartItem(null);
			setQuantity(cartItem?.quantity ?? 0);

			if (error instanceof Error) {
				console.log(error.message);
				return;
			}

			console.log(error);
		}
	};

	return (
		<CardComponent shadow="sm" padding="sm" radius="md" withBorder>
			<CardSectionComponent>
				<ImageComponent h={150} fit="fill" src={item.images[0]} />
			</CardSectionComponent>

			<GroupComponent justify="space-between" mt="md" mb="xs">
				<TextComponent
					text={`${item.name}`}
					bold
					className="text-justify"
				/>
			</GroupComponent>

			<SpoilerComponent maxHeight={45} showLabel="more" hideLabel="less">
				<TextComponent
					size="sm"
					c="dimmed"
					className="text-justify"
					text={item.short_description}
				/>
			</SpoilerComponent>

			<GroupComponent justify="space-between" mt="md">
				<TextComponent
					bold
					size="xl"
					text={`${currencySign} ${item.price}`}
					c="green"
					className="text-justify"
				/>

				{!cartItem ? (
					<ButtonComponent w="50%" h={40} onClick={onAddClick}>
						Add
					</ButtonComponent>
				) : (
					<div className="w-[50%] h-[40px] rounded-[20px] flex bg-gray-200 justify-between items-center">
						<ButtonComponent
							style={{
								height: "40px",
								width: "30%",
								fontSize: 30,
								alignContent: "center",
								backgroundColor: "bg-gr",
								justifyContent: "center",
								display: "flex",
								border: "1px solid gray",
								borderRadius: "8px 0 0 8px",
							}}
							px={5}
							onClick={handleSubtractButtonClick}
						>
							<Minus size={16} />
						</ButtonComponent>

						<MantineProviderComponent theme={centeredInputTheme}>
							<NumberInputComponent
								min={0}
								step={1}
								hideControls
								placeholder="0"
								setValue={(val: string | number) => {
									setQuantity(Number(val));
								}}
								value={quantity}
								variant="unstyled"
								handlersRef={numberInputRef}
								style={{
									width: "40%",
									height: "38px",
									border: "none",
									display: "flex",
									fontWeight: "bold",
									backgroundColor: "white",
								}}
								contentEditable={!isAddToCartApiBusy}
								onBlur={onQuantityTypingEnd}
							/>
						</MantineProviderComponent>

						<ButtonComponent
							style={{
								height: "40px",
								width: "30%",
								fontSize: 30,
								alignContent: "center",
								backgroundColor: "bg-gr",
								justifyContent: "center",
								display: "flex",
								border: "1px solid gray",
								borderRadius: "0 8px 8px 0",
							}}
							px={5}
							onClick={handleAddButtonClick}
						>
							<Plus size={16} />
						</ButtonComponent>
					</div>
				)}
			</GroupComponent>
		</CardComponent>
	);
};
