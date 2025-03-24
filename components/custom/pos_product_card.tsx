"use client";

import { useRecoilState, useSetRecoilState } from "recoil";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { NumberInputHandlers } from "@mantine/core";
import { CartItemModel, CartModel, ItemModel } from "@/models";
import {
	cartAtom,
	cartIdAtom,
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
	StackComponent,
	TextComponent,
	TooltipComponent,
} from "../mantine";
import { centeredInputTheme } from "@/constants";
import ShowNotification from "@/components/mantine/show_notification";

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
	const [loading, setLoading] = useState(false);
	const numberInputRef = useRef<NumberInputHandlers>(null);
	const [sendDebouncedCall, setSendDebouncedCall] = useState<boolean>(false);
	const [quantity, setQuantity] = useState<number>(
		cartItem ? cartItem.quantity : 0
	);

	const setCartId = useSetRecoilState(cartIdAtom);
	const setCartItems = useSetRecoilState<Array<CartItemModel>>(cartItemsAtom);
	const [cart, setCart] = useRecoilState<CartModel | null>(cartAtom);

	// const [pendingQueue, setPendingQueue] = useState<(() => Promise<void>)[]>([]);
	// const [processingQueue, setProcessingQueue] = useState(false);

	// const processQueue = async () => {
	// 	if (processingQueue) return;
	//
	// 	setProcessingQueue(true);
	//
	// 	while (pendingQueue.length > 0) {
	// 		const task = pendingQueue.shift();
	// 		if (task) {
	// 			await task(); // Execute the task
	// 		}
	// 	}
	//
	// 	setProcessingQueue(false);
	// };

	// const addToQueue = (task: () => Promise<void>) => {
	// 	setPendingQueue((prev) => [...prev, task]);
	// 	if (!processingQueue) {
	// 		processQueue(); // Start processing if not already processing
	// 	}
	// };

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
		if (loading) return;

		setLoading(true);
		toggleIsAddToCartApiBusy(true);

		try {
			let prevCart = cart;

			if (!prevCart) {
				const cartCreationResponse = await upsertCartApi(
					{},
					(response: any) => {
						setCartId(response?.cart?.cart_id);
					},
					(err: any) => {
						ShowNotification(err?.error, "error");
						setLoading(false);
						toggleIsAddToCartApiBusy(false);
					},
					() => {
						logoutUser(router);
						setLoading(false);
						toggleIsAddToCartApiBusy(false);
					}
				);

				if (cartCreationResponse && typeof cartCreationResponse !== "string" && cartCreationResponse?.cart) {
					setCart(cartCreationResponse.cart);
					prevCart = cartCreationResponse.cart;
				}
			}

			if (!prevCart?.cart_id) {
				let attempts = 0;
				while (!cart?.cart_id && attempts < 5) {
					await new Promise<void>((resolve) => {
						setTimeout(resolve, 500);
					});
					attempts += 1;
				}
				if (!cart?.cart_id) {
					ShowNotification("Failed to create cart", "error");
					setLoading(false);
					toggleIsAddToCartApiBusy(false);
					return;
				}
				prevCart = cart;
			}

			const cartItemCreated = await upsertCartItemApi(
				{
					item_id: item?.item_id,
					cart_id: prevCart?.cart_id,
					quantity: 1,
				},
				() => {
					setLoading(false);
					setSendDebouncedCall(false);
				},
				(err: any) => {
					ShowNotification(err?.error, "error");
					setLoading(false);
					setSendDebouncedCall(false);
				},
				() => {
					logoutUser(router);
					setLoading(false);
					setSendDebouncedCall(false);
				}
			);

			if (cartItemCreated && typeof cartItemCreated !== "string" && cartItemCreated?.cartItem) {
				setCartItems((prev) => [...prev, cartItemCreated.cartItem]);
				setQuantity(cartItemCreated.cartItem.quantity);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		} finally {
			toggleIsAddToCartApiBusy(false);
			setLoading(false);
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
			setLoading(false);
			setSendDebouncedCall(true);

			setTimeout(async () => {
				setAddSubCartItem(null);
			}, 1000);

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
			setSendDebouncedCall(true);
			setLoading(false);

			setTimeout(async () => {
				setAddSubCartItem(null);
			}, 1000);

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
			if (Number(quantity) < 1) {
				await deleteCartItemApi(
					cartItem?.cart_item_id ?? "",
					() => {
					},
					() => {
					},
					() => {
						logoutUser(router);
					}
				);

				setCartItems((prev) =>
					prev.filter(
						(prevItem) =>
							prevItem.cart_item_id !== cartItem?.cart_item_id
					)
				);
			} else {
				const updatedCartItem = await upsertCartItemApi(
					{
						id: cartItem ? cartItem.cart_item_id : undefined,
						item_id: item.item_id,
						cart_id: cart ? cart.cart_id : undefined,
						quantity,
					},
					() => {
					},
					() => {
					},
					() => {
						logoutUser(router);
					}
				);

				if (updatedCartItem && typeof updatedCartItem !== "string") {
					setCartItems((prev) => prev.map((prevItem) => {
						if (
							prevItem.cart_item_id ===
							updatedCartItem.cartItem.cart_item_id
						) {
							return updatedCartItem.cartItem;
						}

						return prevItem;
					}));
				}
			}

			toggleIsAddToCartApiBusy(false);
			setAddSubCartItem(null);
		} catch (error) {
			toggleIsAddToCartApiBusy(false);
			setAddSubCartItem(null);
			setQuantity(cartItem?.quantity ?? 0);
			setLoading(false);

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
				<ImageComponent
					h={150}
					mih={150}
					src={item.images[0]}
					/>
			</CardSectionComponent>

			<StackComponent gap={10} pt={10} justify="space-between">

				<TooltipComponent position="bottom-start" label={item.name}>
					<TextComponent
						bold
						lineClamp={1}
						text={item.name}
					/>
				</TooltipComponent>

				{/*<SpoilerComponent maxHeight={40} showLabel="more" hideLabel="less">*/}
				{/*	<TextComponent*/}
				{/*		size="sm"*/}
				{/*		c="dimmed"*/}
				{/*		ta="justify"*/}
				{/*		text={item.short_description}*/}
				{/*	/>*/}
				{/*</SpoilerComponent>*/}

				<GroupComponent justify="space-between">
					<StackComponent gap={0} pt={10} justify="start">
						<TextComponent
							size="xs"
							text={`${currencySign} ${item.msrp}`}
							td="line-through"
							c="gray"
						/>
						<TextComponent
							bold
							size="md"
							text={`${currencySign} ${item.price}`}
							c="green"
						/>
					</StackComponent>

					{!cartItem ? (
						<ButtonComponent
							w="50%"
							h={40}
							onClick={onAddClick}
							loading={loading}
						>
							Add
						</ButtonComponent>
					) : (
						<div style={{
							width: "50%",
							borderRadius: "20px",
							display: "flex",
							backgroundColor: "gray-200",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
							<ButtonComponent
								style={{
									height: 40,
									width: "30%",
									fontSize: 30,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "bg-gr",
									border: "1px solid gray",
									borderRadius: "8px 0 0 8px",
								}}
								px={5}
								onClick={handleSubtractButtonClick}
								disabled={sendDebouncedCall}
							>
								<Minus size={16} />
							</ButtonComponent>

							<MantineProviderComponent theme={centeredInputTheme}>
								<NumberInputComponent
									min={0}
									step={1}
									readOnly
									hideControls
									placeholder="0"
									setValue={(val) => setQuantity(Number(val))}
									value={quantity}
									variant="unstyled"
									handlersRef={numberInputRef}
									style={{
										width: "40%",
										height: 38,
										border: "none",
										display: "flex",
										fontWeight: "bold",
										backgroundColor: "white",
										justifyContent: "center",
										alignItems: "center",
										color: "black", // Keep the text color active
										cursor: "default", // Normal cursor to avoid confusion
									}}
									contentEditable={!isAddToCartApiBusy}
									onBlur={onQuantityTypingEnd}
								/>
							</MantineProviderComponent>

							<ButtonComponent
								style={{
									height: 40,
									width: "30%",
									fontSize: 30,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "bg-gr",
									border: "1px solid gray",
									borderRadius: "0 8px 8px 0",
								}}
								px={5}
								onClick={handleAddButtonClick}
								disabled={sendDebouncedCall}
							>
								<Plus size={16} />
							</ButtonComponent>
						</div>
					)}
				</GroupComponent>

			</StackComponent>
		</CardComponent>
	);
};
