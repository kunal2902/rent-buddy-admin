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
	ImageComponent, NumberInputComponent,
	ScrollAreaComponent,
	SelectComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
	TooltipComponent
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
import { ComboBoxProps } from "@/types";
import { CartItemModel, CartModel } from "@/models";
import InvoiceDetailModal from "@/components/custom/invoice_detail_modal";
import ShowNotification from "@/components/mantine/show_notification";
import AddCustomerModal from "@/containers/9_customers/add_customer_modal";
import AddShipToModal from "@/components/custom/add_ship_to_modal";
import { MdOutlineEdit } from "react-icons/md";
import PriceBreakupModal from "@/components/custom/price_breakup_modal";

export const PosCartSection = () => {
	const router = useRouter();
	const [subTotal, setSubTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [openShipToModal, setOpenShipToModal] = useState<boolean>(false);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState<boolean>(false);
	const [priceBreakupModal, setPriceBreakupModal] = useState<boolean>(false);
	const [customersList, setCustomersList] = useState<ComboBoxProps[]>([]);

	const [address, setAddress] = useState<string | undefined>("");
	const [city, setCity] = useState<string | undefined>("");
	const [state, setState] = useState<string | undefined>("");
	const [pinCode, setPinCode] = useState<string | undefined>("");
	const [fullAddress, setFullAddress] = useState<string | undefined>("");

	const [deliveryCharges, setDeliveryCharges] = useState<string | number | undefined>(0);
	const [removalCharges, setRemovalCharges] = useState<Record<number, number>>({});

	const [total, setTotal] = useState(0);
	const [tax5, setTax5] = useState(0);
	const [tax7, setTax7] = useState(0);

	const [cartId, setCartId] = useRecoilState(cartIdAtom);
	const [paymentMethod, setPaymentMethod] = useRecoilState(cartPaymentMethodAtom);
	const setCart = useSetRecoilState<CartModel | null>(cartAtom);
	const [selectedCustomer, setSelectedCustomer] =
		useRecoilState(customerAtom);

	const [cartItems, setCartItems] =
		useRecoilState<Array<CartItemModel>>(cartItemsAtom);
	const selectComponentKey = selectedCustomer.id + selectedCustomer.name;

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
			() => {
				logoutUser(router);
			},
		).then();
	}, [callApi]);

	useEffect(() => {
		const combinedAddress = `${address || ''}, ${city || ''}, ${state || ''}, ${pinCode || ''}`;
		setFullAddress(combinedAddress);
	}, [address, city, state, pinCode]);

	useEffect(() => {
		const subtotal = calculateSubtotal();
		setSubTotal(subtotal);

		const calculatedTax5 = (subtotal * 5) / 100;

		const calculatedTax7 = (subtotal * 7) / 100;

		const calculatedTotal = subtotal + calculatedTax5 + calculatedTax7 + totalRemovalCharges + Number(deliveryCharges);

		setTax5(calculatedTax5);
		setTax7(calculatedTax7);
		setTotal(calculatedTotal);
	}, [cartItems, removalCharges, deliveryCharges]);

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

			// custom_attributes.forEach((attr) => {
			// 	const tax = calculateTaxOnProduct(attr, itemPrice, quantity);
			// 	if (tax !== null) {
			// 		itemTotal += tax;
			// 	}
			// });

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

	const ehfFees: Record<string, number> = {
		"Fridges/Freezers/AC": 6.50,
		"Dishwashers": 2.00,
		"Washer/Dryer/Range/Stacker/Laundry Paris": 2.00,
		"Microwaves": 5.00,
		"OTR/Hoodfan": 2.00,
		"DVD/Bluray/OLED/Sound Bar": 2.50,
	};

	const findCategory = (categoryName: string): string | undefined => {
		return Object.keys(ehfFees).find((key) =>
			key.toLowerCase().includes(categoryName.toLowerCase())
		);
	};

	const calculateEHF = (categoryName: string, quantity: number) => {
		const matchedCategory = findCategory(categoryName);

		if (!matchedCategory) {
			return 0;
		}

		const fee = ehfFees[matchedCategory] || 0;

		return fee * quantity;
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

	const handleCheckout = async () => {
		if (cartItems.length === 0) {
			ShowNotification("Please select item first!", "error");
		} else if (!selectedCustomer.id) {
			ShowNotification("Please select customer first!", "error");
		} else if (!paymentMethod) {
			ShowNotification("Please select payment method first!", "error");
		} else if (!address) {
			ShowNotification("Please select shipping address first!", "error");
		} else if (!deliveryCharges) {
			ShowNotification("Please select delivery charges first!", "error");
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

	const handleRemovalChargeChange = (index: number, value: number) => {
		setRemovalCharges((prev) => ({
			...prev,
			[index]: value,
		}));
	};

	const totalRemovalCharges = Object.values(removalCharges).reduce((sum, charge) => sum + (charge || 0), 0);

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
									setOpenAddModal(true);
								}}
							>
								<AddIcon />
							</ActionIconComponent>
						</TooltipComponent>
					</GroupComponent>
				</BoxComponent>

				<BoxComponent className="mt-3" h={30}>
					<TextComponent bold size="l" text="Order Details" />
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
						{/*<GroupComponent justify="space-between">*/}
						{/*	<TextComponent text="Customer Name:" bold />*/}
						{/*	<TextComponent*/}
						{/*		text={*/}
						{/*			selectedCustomer.name*/}
						{/*				? selectedCustomer.name*/}
						{/*				: ""*/}
						{/*		}*/}
						{/*	/>*/}
						{/*</GroupComponent>*/}
						<GroupComponent justify="space-between">
							<TextComponent text="Order Date:" bold />
							<TextComponent text={formatDate(new Date())} />
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="Payment type:" bold />
							<SelectComponent
								size="sm"
								required
								data={paymentOptions}
								value={paymentMethod}
								placeholder="Select Payment Type"
								setValue={setPaymentMethod}
								setOption={handlePaymentMethodChange}
							/>
						</GroupComponent>
						{address === "" && city === "" && state === "" && pinCode === "" ?
						<GroupComponent justify="end">
							<ButtonComponent
								variant="subtle"
								title="Add Shipping Address"
								onClick={() =>setOpenShipToModal(true)}
							/>
						</GroupComponent>
						:
							<GroupComponent justify="space-between">
								<TextComponent text="Ship To:" bold />
								<TooltipComponent position="bottom-start" label={fullAddress}>
									<TextComponent text={truncateText(fullAddress || '', 35)} />
								</TooltipComponent>
								<ActionIconComponent
									onClick={() =>setOpenShipToModal(true)}
									size="md"
								>
									<MdOutlineEdit size={18} />
								</ActionIconComponent>
							</GroupComponent>
						}
						{/*<GroupComponent justify="space-between">*/}
						{/*	{address === "" && city === "" && state === "" && pinCode === "" ?*/}
						{/*		<>*/}
						{/*			<TextComponent text="Ship To:" bold />*/}
						{/*			<TooltipComponent label="Add Shipping Address">*/}
						{/*				<ActionIconComponent*/}
						{/*					w={40}*/}
						{/*					h={40}*/}
						{/*					variant="filled"*/}
						{/*					onClick={() => {*/}
						{/*						setOpenShipToModal(true);*/}
						{/*					}}*/}
						{/*				>*/}
						{/*					<AddIcon />*/}
						{/*				</ActionIconComponent>*/}
						{/*			</TooltipComponent>*/}
						{/*		</>*/}
						{/*		:*/}
						{/*		<TextComponent text={`${address}, ${city}, ${state}, ${pinCode}`} />*/}
						{/*	}*/}
						{/*</GroupComponent>*/}
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
										<GroupComponent
											justify="space-between"
											my={5}
										>
											<TextComponent
												lh={1}
												fz={12}
												text={"EHF"}
											/>
											<TextComponent
												lh={1}
												fz={12}
												text={`${currencySign} ${calculateEHF(item.item.category.name, item.quantity)}`}
											/>
										</GroupComponent>
										<GroupComponent
											justify="space-between"
											my={5}
										>
											<TextComponent
												lh={1}
												fz={12}
												text={"Removal"}
											/>
											<NumberInputComponent
												w={80}
												min={0}
												required
												size="xs"
												prefix="$ "
												value={removalCharges[index] || 0}
												setValue={(value) => handleRemovalChargeChange(index, Number(value))}
											/>
										</GroupComponent>
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
						{/*<GroupComponent justify="space-between">*/}
						{/*	<TextComponent text="Sub Total:" size="sm" />*/}
						{/*	<TextComponent*/}
						{/*		text={`${currencySign} ${subTotal.toFixed(2)}`}*/}
						{/*		bold*/}
						{/*		size="sm"*/}
						{/*	/>*/}
						{/*</GroupComponent>*/}
						{/*<GroupComponent justify="space-between">*/}
						{/*	<TextComponent text="5% GST:" size="sm" />*/}
						{/*	<TextComponent*/}
						{/*		text={`${currencySign} ${tax5.toFixed(2)}`}*/}
						{/*		bold*/}
						{/*		size="sm"*/}
						{/*	/>*/}
						{/*</GroupComponent>*/}
						{/*<GroupComponent justify="space-between">*/}
						{/*	<TextComponent text="7% PST:" size="sm" />*/}
						{/*	<TextComponent*/}
						{/*		text={`${currencySign} ${tax7.toFixed(2)}`}*/}
						{/*		bold*/}
						{/*		size="sm"*/}
						{/*	/>*/}
						{/*</GroupComponent>*/}
						<GroupComponent justify="space-between">
							<TextComponent text="Delivery Charges:" size="sm" bold />
							<NumberInputComponent
								w={80}
								min={0}
								required
								size="sm"
								prefix="$ "
								title="Delivery Charges"
								value={deliveryCharges}
								setValue={setDeliveryCharges}
								placeholder="Delivery Charges"
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
						<GroupComponent justify="end">
							<ButtonComponent
								variant="subtle"
								title="View Price Breakup"
								onClick={() => setPriceBreakupModal(true)}
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

			{priceBreakupModal &&(
				<PriceBreakupModal
					isOpen={priceBreakupModal}
					onClose={() => setPriceBreakupModal(false)}
					totalRemovalCharges={totalRemovalCharges}
					deliveryCharges={deliveryCharges}
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

			{openShipToModal &&
				<AddShipToModal
					isOpen={openShipToModal}
					onClose={() => setOpenShipToModal(false)}
					setAddress={setAddress}
					address={address}
					setCity={setCity}
					city={city}
					setState={setState}
					state={state}
					setPinCode={setPinCode}
					pinCode={pinCode}
				/>
			}
		</>
	);
};

export default PosCartSection;
