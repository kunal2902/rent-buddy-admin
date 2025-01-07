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
	cartAtom,
	cartDraftApi,
	cartIdAtom,
	cartItemsAtom, cartPaymentMethodAtom,
	checkoutApi,
	currencySign,
	customerAtom,
	deleteCartApi,
	formatDate,
	getCustomerApi,
	logoutUser, paymentOptions,
	toTitleCase,
	upsertCartApi
} from "@/utils";
import { ComboBoxProps, FullComboBoxProps } from "@/types";
import { CartItemModel, CartModel } from "@/models";
import InvoiceDetailModal from "@/components/custom/invoice_detail_modal";
import ShowNotification from "@/components/mantine/show_notification";
import AddCustomerModal from "@/containers/9_customers/add_customer_modal";

export const PosCartSection = () => {
	const router = useRouter();
	const [subTotal, setSubTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState<boolean>(false);
	const [customersList, setCustomersList] = useState<FullComboBoxProps[]>([]);

	const [total, setTotal] = useState(0); // State for total amount
	const [tax5, setTax5] = useState(0); // State for 5% tax
	const [tax7, setTax7] = useState(0); // State for 7% tax

	const [cartId, setCartId] = useRecoilState(cartIdAtom);
	const [paymentMethod, setPaymentMethod] = useRecoilState(cartPaymentMethodAtom);
	const setCart = useSetRecoilState<CartModel | null>(cartAtom);
	const [selectedCustomer, setSelectedCustomer] =
		useRecoilState(customerAtom);
	console.log(selectedCustomer);
	const [cartItems, setCartItems] =
		useRecoilState<Array<CartItemModel>>(cartItemsAtom);
	const selectComponentKey = selectedCustomer.id + selectedCustomer.name;

	useEffect(() => {
		getCustomerApi(
			"",
			(data: any) => {
				const formattedCustomers = data.customers.map(
					(customer: {
						customer_id: string;
						name: string
						address: string;
						city: string;
						state: string;
						pinCode: string;
					}) => ({
						value: customer.customer_id,
						label: customer.name,
						address: customer.address,
						city: customer.city,
						state: customer.state,
						pinCode: customer.pinCode,
					}),
				);
				setCustomersList(formattedCustomers);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		).then();
	}, [callApi]);

	useEffect(() => {
		const subtotal = calculateSubtotal();
		setSubTotal(subtotal);

		// Calculate 5% tax
		const calculatedTax5 = (subtotal * 5) / 100;

		// Calculate 7% tax
		const calculatedTax7 = (subtotal * 7) / 100;

		// Calculate total
		const calculatedTotal = subtotal + calculatedTax5 + calculatedTax7;

		// Update state
		setTax5(calculatedTax5);
		setTax7(calculatedTax7);
		setTotal(calculatedTotal);
	}, [cartItems]);

	const handleCustomerChange = (option: {
		value: string;
		label: string
		address: string;
		city: string;
		state: string;
		pinCode: string;
	}) => {
		setSelectedCustomer({
			id: option.value,
			name: option.label,
			address: option.address,
			city: option.city,
			state: option.state,
			pinCode: option.pinCode,
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
					address: "",
					city: "",
					state: "",
					pinCode: "",
				});
				setPaymentMethod("");
				ShowNotification("Success", "success");
			},
			(err: any) => {
				ShowNotification(err.error, "error");
			},
			() => {
				logoutUser(router);
			},
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
				ShowNotification("Success", "success");
			},
			(err: any) => {
				ShowNotification(err.error, "error");
			},
			() => {
				logoutUser(router);
			},
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

	const handleCheckout = async () => {
		if (cartItems.length === 0) {
			ShowNotification("Please select item first!", "error");
		} else if (!selectedCustomer.id) {
			ShowNotification("Please select customer first!", "error");
		} else if (!paymentMethod) {
			ShowNotification("Please select payment method first!", "error");
		} else {
			setLoading(true);
			const body = {
				id: cartId,
				customer_id: selectedCustomer.id,
				label: "Purchased!",
				payment_method: paymentMethod,
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
							setLoading(false);
							setInvoiceDialogOpen(true);
							ShowNotification("Success", "success");
						},
						(err: any) => {
							ShowNotification(err.error, "error");
							setLoading(false);
						},
						() => {
							logoutUser(router);
						},
					);
				},
				(err: any) => {
					ShowNotification(err.error, "error");
					setLoading(false);
				},
				() => {
					logoutUser(router);
				},
			);
		}
	};

	const truncateText = (text: string, maxLength: number): string => text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

	const handlePaymentMethodChange = (option: ComboBoxProps) => {
		setPaymentMethod(option.value);
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
							key={selectComponentKey}
							data={customersList}
							value={selectedCustomer.id}
							placeholder="Select Customer"
							setValue={(val) => {
								const option = customersList.find((c) => c.value === val);
								if (option) {
									handleCustomerChange(option);
								}
							}}
							style={{ width: "calc(100% - 60px)" }}
						/>
						<TooltipComponent label="Add Customer">
							<ActionIconComponent
								w={40}
								h={40}
								variant="filled"
								onClick={() => {
									setOpenAddModal(true);
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
										: ""
								}
							/>
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="Order Date:" bold />
							<TextComponent text={formatDate(new Date())} />
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="Payment type" bold />
							<SelectComponent
								required
								data={paymentOptions}
								value={paymentMethod}
								placeholder="Select Payment Type"
								setValue={setPaymentMethod}
								setOption={handlePaymentMethodChange}
							/>
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
									px={20}
									py={8}
									pb={index === cartItems.length - 1 ? 0 : 12}
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
													<TooltipComponent position="bottom-start" label={item.item.name}>
														<TitleComponent
															fz={14}
															title={truncateText(item.item.name, 30)}
															mb={5}
														/>
													</TooltipComponent>

													<TitleComponent
														fz={14}
														c="green"
														title={`${currencySign} ${Number(Number(item.item.price).toFixed(2)) * item.quantity}`}
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
											(ca, key) => (
												<GroupComponent
													justify="space-between"
													my={5}
													key={key}
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
																${calculateTaxOnProduct(ca, item.item.price, item.quantity)?.toFixed(2)}`}
													/>
												</GroupComponent>
											),
										)}
										{index !== cartItems.length - 1 && (
											<DividerComponent
												mt={6}
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
								text={`${currencySign} ${subTotal.toFixed(2)}`}
								bold
								size="sm"
							/>
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="5% GST:" size="sm" />
							<TextComponent
								text={`${currencySign} ${tax5.toFixed(2)}`}
								bold
								size="sm"
							/>
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="7% PST:" size="sm" />
							<TextComponent
								text={`${currencySign} ${tax7.toFixed(2)}`}
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
								text={`${currencySign} ${total.toFixed(2)}`}
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
								onClick={() => clearCart()}
							>
								<RiDeleteBin6Line />
							</ActionIconComponent>
						</TooltipComponent>
						<GroupComponent
							grow
							justify="space-evenly"
							style={{ flexGrow: 1 }}
						>
							{/*<TooltipComponent*/}
							{/*	label="Please select customer"*/}
							{/*	disabled={selectedCustomer.id && cartItems.length > 0}*/}
							{/*>*/}
							{/*	<ButtonComponent*/}
							{/*		color={appAccentColorRGBA}*/}
							{/*		title="Save Draft"*/}
							{/*		onClick={handleSaveDraft}*/}
							{/*		disabled={selectedCustomer.id === ""}*/}
							{/*		fullWidth*/}
							{/*	/>*/}
							{/*</TooltipComponent>*/}
							{/*<TooltipComponent*/}
							{/*	label="Please select customer"*/}
							{/*	disabled={selectedCustomer.id && cartItems.length > 0}*/}
							{/*>*/}
							<ButtonComponent
								title="Checkout"
								onClick={handleCheckout}
								loading={loading}
									// disabled={selectedCustomer.id === ""}
								fullWidth
								/>
							{/*</TooltipComponent>*/}
						</GroupComponent>
					</GroupComponent>
				</BoxComponent>
			</div>

			{invoiceDialogOpen && (
				<InvoiceDetailModal
					isOpen={invoiceDialogOpen}
					onClose={() => setInvoiceDialogOpen(false)}
					subTotal={subTotal}
					total={total}
					tax5={tax5}
					tax7={tax7}
				/>
			)}

			{openAddModal &&
				<AddCustomerModal
					customerId=""
					isOpen={openAddModal}
					onClose={() => setOpenAddModal(false)}
					setCallApi={setCallApi}
					initialValueName=""
					initialValuePhoneNumber=""
					initialValueEmail=""
					initialValueAddress=""
					initialValueCity=""
					initialValuePinCode=""
					initialValueState=""
				/>
			}
		</>
	);
};

export default PosCartSection;
