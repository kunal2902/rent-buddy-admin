"use client";

import React, { useEffect, useState } from "react";
import { AddIcon } from "@storybook/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import {
	ActionIconComponent,
	BoxComponent,
	ButtonComponent,
	CardComponent,
	CenterComponent,
	DividerComponent,
	GroupComponent,
	ImageComponent,
	ScrollAreaComponent,
	SelectComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
	TooltipComponent,
} from "@/components";
import {
	appAccentColorRGBA,
	cartAtom,
	cartDraftApi,
	cartIdAtom,
	cartItemsAtom,
	checkoutApi,
	currencySign,
	customerAtom,
	deleteCartApi,
	formatDate,
	getCustomerApi,
	logoutUser,
	toTitleCase,
	upsertCartApi,
} from "@/utils";
import { ComboBoxProps } from "@/types";
import { CartItemModel, CartModel } from "@/models";
import InvoiceDetailModal from "@/components/custom/invoice_detail_modal";

export const PosCartSection = () => {
	const router = useRouter();

	const [subTotal, setSubTotal] = useState(0);
	const [customerModalOpen, setCustomerModalOpen] = useState(false);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState<boolean>(false);
	const [customersList, setCustomersList] = useState<ComboBoxProps[]>([]);

	const [cartId, setCartId] = useRecoilState(cartIdAtom);
	const setCart = useSetRecoilState<CartModel | null>(cartAtom);
	const [selectedCustomer, setSelectedCustomer] =
		useRecoilState(customerAtom);
	const [cartItems, setCartItems] =
		useRecoilState<Array<CartItemModel>>(cartItemsAtom);

	useEffect(() => {
		getCustomerApi(
			"",
			(data: any) => {
				const formattedCustomers = data.customers.map(
					(customer: { customer_id: string; name: string }) => ({
						value: customer.customer_id,
						label: customer.name,
					}),
				);
				setCustomersList(formattedCustomers);
			},
			() => {},
			() => {},
		).then();
	}, []);

	useEffect(() => {
		const subtotal = calculateSubtotal();
		const taxProduct = calculateTotalTaxOnProducts();
		setSubTotal(subtotal + (taxProduct > 0 ? taxProduct : 0));
	}, [cartItems]);

	const handleCustomerChange = (option: { value: string; label: string }) => {
		setSelectedCustomer({
			id: option.value,
			name: option.label,
		});
	};

	const calculateSubtotal = () => {
		let subtotal = 0;
		cartItems.forEach((cartItem) => {
			const {
				item: { price, custom_attributes },
				quantity,
			} = cartItem;
			const itemPrice = parseInt(price, 10);
			let itemTotal = itemPrice * quantity;

			custom_attributes.forEach((attr) => {
				const tax = calculateTaxOnProduct(attr, itemPrice, quantity);
				if (tax !== null) {
					itemTotal += tax;
				}
			});

			subtotal += itemTotal;
		});
		return subtotal;
	};

	const calculateTotal = () => subTotal;

	const clearCart = () => {
		deleteCartApi(
			cartId,
			() => {
				setCartItems([]);
				setCartId("");
				setCart(null);
				setSelectedCustomer({
					id: "",
					name: "",
				});
			},
			() => {},
			() => {},
		).then();
	};

	const handleSaveDraft = () => {
		cartDraftApi(
			cartId,
			() => {
				setCartItems([]);
				setCartId("");
				setCart(null);
				setSelectedCustomer({
					id: "",
					name: "",
				});
			},
			() => {},
			() => {},
		).then();
	};

	const calculateTaxOnProduct = (attr: any, price: any, quantity: any) => {
		if (attr) {
			if (
				attr.custom_attribute.is_tax &&
				attr.custom_attribute.tax_type === "on_product"
			) {
				if (attr.custom_attribute.type === "number") {
					const attributeVal = Number(attr.attribute_value);
					return attributeVal * quantity;
				}
				if (attr.custom_attribute.type === "percentage") {
					const itemPrice = Number(price);
					return (
						(itemPrice / 100) *
						Number(attr.attribute_value) *
						Number(quantity)
					);
				}
				return null;
			}
			return null;
		}
		return null;
	};

	const calculateTotalTaxOnProducts = () => {
		const totalTax = 0;
		cartItems.forEach(() => {
			// totalTax += calculateTaxOnProduct(item);
		});
		return totalTax;
	};

	const calculateTaxOnBill = () => {
		let taxOnBill = 0;

		cartItems.forEach((item) => {
			if (item.item.custom_attributes) {
				item.item.custom_attributes.forEach(
					(attr: {
						custom_attribute: {
							is_tax: any;
							tax_type: string;
							type: string;
						};
						attribute_value: string;
					}) => {
						if (
							attr.custom_attribute.is_tax &&
							attr.custom_attribute.tax_type === "on_bill"
						) {
							if (attr.custom_attribute.type === "number") {
								taxOnBill += parseFloat(attr.attribute_value);
							} else if (
								attr.custom_attribute.type === "percentage"
							) {
								const itemPrice = parseFloat(item.item.price);
								const percentageValue =
									parseFloat(attr.attribute_value) / 100;
								const taxForItem = itemPrice * percentageValue;
								taxOnBill += taxForItem;
							}
						}
					},
				);
			}
		});

		return taxOnBill;
	};

	const handleCheckout = async () => {
		const body = {
			id: cartId,
			customer_id: selectedCustomer.id,
			label: "Purchased!",
		};
		await upsertCartApi(
			body,
			() => {
				const checkoutBody = {
					cartId,
				};
				checkoutApi(
					checkoutBody,
					() => {
						setInvoiceDialogOpen(true);
					},
					() => {},
					() => {},
				);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		);
	};

	return (
		<>
			<div
				className="w-[30%] pr-3 mt-1"
				style={{
					display: "flex",
					flexDirection: "column",
					height: "calc(100vh - 56px)",
				}}
			>
				<BoxComponent h={40}>
					<GroupComponent>
						<SelectComponent
							required
							data={customersList}
							value={selectedCustomer.id ?? ""}
							placeholder="Select Customer"
							setValue={(val) => {
								const option = customersList.find(
									(c) => c.value === val,
								);
								if (option) {
									handleCustomerChange(option);
								}
							}}
							setOption={handleCustomerChange}
							style={{ width: "calc(100% - 60px)" }}
						/>
						<TooltipComponent label="Add Customer">
							<ActionIconComponent
								w={40}
								h={40}
								variant="filled"
								onClick={() => {
									setCustomerModalOpen(true);
								}}
							>
								<AddIcon />
							</ActionIconComponent>
						</TooltipComponent>
					</GroupComponent>
				</BoxComponent>

				<BoxComponent className="mt-3" h={30}>
					<TextComponent bold size="xl" text="Order Details" />
				</BoxComponent>

				<CardComponent
					className="mt-3"
					mih={90}
					shadow="sm"
					radius="md"
					padding="sm"
					withBorder
				>
					<StackComponent gap="sm">
						<GroupComponent justify="space-between">
							<TextComponent text="Customer Name:" bold />
							<TextComponent
								text={
									selectedCustomer.name
										? selectedCustomer.name
										: "N/A"
								}
							/>
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="Order Date:" bold />
							<TextComponent text={formatDate(new Date())} />
						</GroupComponent>
					</StackComponent>
				</CardComponent>

				<CardComponent
					p={0}
					shadow="sm"
					radius="md"
					withBorder
					className="my-3"
					style={{ flexGrow: 1 }}
				>
					{cartItems.length === 0 ? (
						<CenterComponent h="100%">
							<FiShoppingCart />
							<TextComponent text="Cart is Empty!" ml={5} />
						</CenterComponent>
					) : (
						<ScrollAreaComponent>
							{cartItems.map((item, index) => (
								<BoxComponent
									key={index}
									px={12}
									pt={6}
									pb={index === cartItems.length - 1 ? 0 : 6}
								>
									<StackComponent gap={0}>
										<GroupComponent
											justify="space-between"
											align="start"
											gap={0}
										>
											<ImageComponent
												src={item.item.images[0]}
												w={30}
												h={30}
											/>
											<StackComponent
												ml={10}
												gap={0}
												style={{ flexGrow: 1 }}
											>
												<GroupComponent justify="space-between">
													<TitleComponent
														fz={14}
														title={item.item.name}
													/>

													<TitleComponent
														fz={14}
														c="green"
														title={`${currencySign} ${parseInt(item.item.price.toString(), 10) * item.quantity}`}
													/>
												</GroupComponent>
												<TextComponent
													c="gray"
													fz={12}
													text={`${currencySign} ${parseInt(item.item.price.toString(), 10)} x ${item.quantity}`}
												/>
											</StackComponent>
										</GroupComponent>
										{item.item.custom_attributes.map(
											(ca) => (
												<GroupComponent
													justify="space-between"
													my={2}
												>
													<TextComponent
														lh={1}
														fz={12}
														text={toTitleCase(
															ca.custom_attribute
																.name,
														)}
													/>
													<TextComponent
														lh={1}
														fz={12}
														text={`${currencySign} 
																${calculateTaxOnProduct(ca, item.item.price, item.quantity)}`}
													/>
												</GroupComponent>
											),
										)}
										{index !== cartItems.length - 1 && (
											<DividerComponent
												my={0}
												variant="dashed"
												p={0}
												py={0}
											/>
										)}
									</StackComponent>
								</BoxComponent>
							))}
						</ScrollAreaComponent>
					)}
				</CardComponent>

				<CardComponent
					padding="sm"
					shadow="sm"
					radius="md"
					withBorder
					style={{ height: "auto" }}
				>
					<StackComponent gap="sm">
						<GroupComponent justify="space-between">
							<TextComponent text="Sub Total:" size="sm" />
							<TextComponent
								text={`${currencySign} ${subTotal}`}
								bold
								size="sm"
							/>
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="On Bill:" size="sm" />
							<TextComponent
								text={`${currencySign} ${calculateTaxOnBill()}`}
								bold
								size="sm"
							/>
						</GroupComponent>
						<DividerComponent
							my={0}
							variant="dashed"
							p={0}
							py={0}
						/>
						<GroupComponent justify="space-between">
							<TextComponent text="Total:" bold />
							<TextComponent
								text={`${currencySign} ${calculateTotal()}`}
								bold
							/>
						</GroupComponent>
					</StackComponent>
				</CardComponent>

				<BoxComponent h={60} className="mt-3">
					<GroupComponent>
						<TooltipComponent label="Clear cart">
							<ActionIconComponent
								c="red"
								maw={36}
								h={36}
								onClick={clearCart}
							>
								<RiDeleteBin6Line />
							</ActionIconComponent>
						</TooltipComponent>
						<GroupComponent
							grow
							justify="space-evenly"
							style={{ flexGrow: 1 }}
						>
							<ButtonComponent
								color={appAccentColorRGBA}
								title="Save Draft"
								onClick={handleSaveDraft}
							/>
							<TooltipComponent label="Please select customer" disabled={selectedCustomer.id}>
								<ButtonComponent
									title="Checkout"
									onClick={handleCheckout}
									disabled={selectedCustomer.id === ""}
									fullWidth
								/>
							</TooltipComponent>
						</GroupComponent>
					</GroupComponent>
				</BoxComponent>
			</div>

			{invoiceDialogOpen && (
				<InvoiceDetailModal
					isOpen={invoiceDialogOpen}
					onClose={() => setInvoiceDialogOpen(false)}
					subTotal={subTotal}
				/>
			)}
		</>
	);
};

export default PosCartSection;
