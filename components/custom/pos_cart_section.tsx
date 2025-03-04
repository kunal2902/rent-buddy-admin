"use client";

import React, { useEffect, useState } from "react";
import { AddIcon } from "@storybook/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
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
	upsertCartApi,
} from "@/utils";
import { ComboBoxProps } from "@/types";
import { CartItemModel, CartModel } from "@/models";
import InvoiceDetailModal from "@/components/custom/invoice_detail_modal";
import ShowNotification from "@/components/mantine/show_notification";
import AddCustomerModal from "@/containers/9_customers/add_customer_modal";
import AddShipToModal from "@/components/custom/add_ship_to_modal";
import PriceBreakupModal from "@/components/custom/price_breakup_modal";
import WarrantyModal from "@/components/custom/warranty_modal";

export const PosCartSection = () => {
	const router = useRouter();
	const [subTotal, setSubTotal] = useState(0);
	const [discount, setDiscount] = useState(0);
	const [warranty, setWarranty] = useState(0);
	const [loading, setLoading] = useState(false);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [openShipToModal, setOpenShipToModal] = useState<boolean>(false);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState<boolean>(false);
	const [priceBreakupModal, setPriceBreakupModal] = useState<boolean>(false);
	const [warrentyModal, setWarrentyModal] = useState<number | null>(null);
	const [orderDate, setOrderDate] = useState<string>("");

	const [customersList, setCustomersList] = useState<ComboBoxProps[]>([]);
		const [selectedWarranties, setSelectedWarranties] = useState<{ [key: number]: { duration: string; price: number } } | null>(null);
	const [totalEHF, setTotalEHF] = useState<number>(0);
	const [address, setAddress] = useState<string | undefined>("");
	const [city, setCity] = useState<string | undefined>("");
	const [state, setState] = useState<string | undefined>("");
	const [pinCode, setPinCode] = useState<string | undefined>("");
	const [fullAddress, setFullAddress] = useState<string | undefined>("");
	const [totalRemovalCharges, setTotalRemovalCharges] = useState<number | undefined>(0);
	const [deliveryCharges, setDeliveryCharges] = useState<string | number | undefined>(0);
	const [removalCharges, setRemovalCharges] = useState<Record<number, number>>({});
	const [totalMsrp, setTotalMsrp] = useState<number>(0);

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
		const total = Object.values(removalCharges).reduce(
			(sum, charge) => sum + (charge || 0),
			0
		);
		setTotalRemovalCharges(total);
	}, [removalCharges]);

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
		const combinedAddress = `${address || ""}, ${city || ""}, ${state || ""}, ${pinCode || ""}`;
		setFullAddress(combinedAddress);
	}, [address, city, state, pinCode]);

	useEffect(() => {
		const totalMsrp = calculateMsrp();
		const totalItemQuantity = calculateItemQuantity();

		const calculatedTax5 = (totalItemQuantity * 5) / 100;
		const calculatedTax7 = (totalItemQuantity * 7) / 100;

		const warrantyTotal = cartItems.reduce((total, item, index) => {
			const warranty = selectedWarranties?.[index];
			console.log("warranty", warranty);
			if (warranty) {
				return total + (warranty.price * item.quantity);
			}
			console.log("total", total);
			return total;
		}, 0);

		console.log("warrantyTotal", warrantyTotal);

		const calculateSubTotal = totalMsrp + calculatedTax5 + calculatedTax7 + Number(totalRemovalCharges) + Number(deliveryCharges) + warrantyTotal + totalEHF;

		const calculatedTotal = calculateSubTotal - (totalMsrp - totalItemQuantity);

		setTotalMsrp(totalMsrp);
		setTax5(calculatedTax5);
		setTax7(calculatedTax7);
		setTotal(calculatedTotal);
		setWarranty(warrantyTotal);
		setSubTotal(calculateSubTotal);
		setDiscount(totalMsrp - totalItemQuantity);
	}, [cartItems, removalCharges, deliveryCharges, totalMsrp]);

	const handleCustomerChange = (option: { value: string; label: string }) => {
		setSelectedCustomer({
			id: option.value,
			name: option.label,
		});
	};

	const calculateItemQuantity = () => {
		let subtotal = 0;
		cartItems.forEach((cartItem) => {
			const {
				item: { price },
				quantity,
			} = cartItem;
			const itemPrice = parseInt(price, 10);
			const itemTotal = itemPrice * quantity;

			subtotal += itemTotal;
		});
		return subtotal;
	};

	const calculateMsrp = () => {
		let totalMsrp = 0;
		cartItems.forEach((cartItem) => {
			const {
				item: { msrp, price },
				quantity,
			} = cartItem;
			const itemMsrp = parseInt(msrp, 10);

			totalMsrp += itemMsrp;
		});
		return totalMsrp;
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
		Dishwashers: 2.00,
		"Washer/Dryer/Range/Stacker/Laundry Paris": 2.00,
		Microwaves: 5.00,
		"OTR/Hoodfan": 2.00,
		"DVD/Bluray/OLED/Sound Bar": 2.50,
	};

	const findCategory = (categoryName: string): string | undefined => Object.keys(ehfFees).find((key) =>
			key.toLowerCase().includes(categoryName.toLowerCase())
		);

	const calculateEHF = (categoryName: string, quantity: number) => {
		const matchedCategory = findCategory(categoryName);

		if (!matchedCategory) {
			return 0;
		}

		const fee = ehfFees[matchedCategory] || 0;
		return fee * quantity;
	};

	useEffect(() => {
		const ehfAmount = cartItems.reduce((total, item) => total + calculateEHF(item.item.category.name, item.quantity), 0);
		setTotalEHF(ehfAmount);
	}, [cartItems, totalEHF]);

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
						details: {
							totalRemovalCharges,
							deliveryCharges,
							paymentMethod,
							fullAddress,
							totalEHF,
							subTotal,
							total,
							tax5,
							tax7,
						},
					};
					checkoutApi(
						checkoutBody,
						(res: any) => {
							setLoading(false);
							setInvoiceDialogOpen(true);
							setOrderDate(res.invoice.created_at);
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
									p={0}
									m={0}
									variant="transparent"
									title="Add Shipping Address"
									onClick={() => setOpenShipToModal(true)}
							/>
							</GroupComponent>
						:
							<GroupComponent justify="space-between">
								<TextComponent text="Ship To:" bold />
								<TooltipComponent position="bottom-start" label={fullAddress}>
									<TextComponent text={truncateText(fullAddress || "", 35)} />
								</TooltipComponent>
								<ActionIconComponent
									onClick={() => setOpenShipToModal(true)}
									size="md"
								>
									<MdOutlineEdit size={18} />
								</ActionIconComponent>
							</GroupComponent>
						}
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
										<GroupComponent justify="space-between" align="start" gap={0}>
											<ImageComponent src={item.item.images[0]} w={30} h={30} />
											<StackComponent ml={10} gap={0} style={{ flexGrow: 1 }}>
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
												<GroupComponent justify="space-between">
													<TextComponent
														c="gray"
														fz={12}
														text={`${currencySign} ${parseInt(
															item.item.price.toString(),
															10
														)} x ${item.quantity}`}
													/>
													<TextComponent
														c="gray"
														fz={12}
														td="line-through"
														text={`${currencySign} ${parseInt(
															item.item.msrp.toString(),
															10
														)}`}
													/>
												</GroupComponent>
											</StackComponent>
										</GroupComponent>

										<GroupComponent justify="space-between" my={5}>
											<TextComponent lh={1} fz={12} text="EHF" />
											<TextComponent
												lh={1}
												fz={12}
												text={`${currencySign} ${calculateEHF(
													item.item.category.name,
													item.quantity
												)}`}
											/>
										</GroupComponent>

										<GroupComponent justify="space-between" my={5}>
											<TextComponent lh={1} fz={12} text="Removal" />
											<NumberInputComponent
												w={80}
												min={0}
												required
												size="xs"
												prefix="$ "
												value={removalCharges[index] || 0}
												setValue={(value) =>
													handleRemovalChargeChange(index, Number(value))
												}
											/>
										</GroupComponent>

										{/* Warranty Logic */}
										{Number(item.item.price) >= 1500 && (
											selectedWarranties?.[index] ? (
												<GroupComponent justify="space-between" my={5}>
													<TextComponent lh={1} fz={12} text={`${selectedWarranties[index]?.duration} Warranty: `} />
													<GroupComponent justify="end">
														<TextComponent
															lh={1}
															fz={12}
															text={`$ ${selectedWarranties[index]?.price * item.quantity}`}
														/>
														<ActionIconComponent
															onClick={() => setWarrentyModal(index)}
															size="md"
														>
															<MdOutlineEdit size={18} />
														</ActionIconComponent>
													</GroupComponent>
												</GroupComponent>
											) : (
												<GroupComponent justify="end">
													<ButtonComponent
														p={0}
														m={0}
														variant="transparent"
														title="Add Warranty"
														onClick={() => setWarrentyModal(index)}
													/>
												</GroupComponent>
											)
										)}

										{/* Divider */}
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
								p={0}
								m={0}
								variant="transparent"
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
							<ButtonComponent
								title="Checkout"
								onClick={handleCheckout}
								loading={loading}
								fullWidth
							/>
						</GroupComponent>
					</GroupComponent>
				</BoxComponent>
			</div>

			{invoiceDialogOpen && (
				<InvoiceDetailModal
					isOpen={invoiceDialogOpen}
					onClose={() => setInvoiceDialogOpen(false)}
					setTotalRemovalCharges={setTotalRemovalCharges}
					totalRemovalCharges={totalRemovalCharges}
					setDeliveryCharges={setDeliveryCharges}
					deliveryCharges={deliveryCharges}
					totalDiscount={totalMsrp}
					fullAddress={fullAddress}
					setAddress={setAddress}
					setPinCode={setPinCode}
					orderDate={orderDate}
					totalEHF={totalEHF}
					discount={discount}
					totalMsrp={totalMsrp}
					setState={setState}
					subTotal={subTotal}
					setCity={setCity}
					total={total}
					tax5={tax5}
					tax7={tax7}
				/>
			)}

			{priceBreakupModal && (
				<PriceBreakupModal
					isOpen={priceBreakupModal}
					onClose={() => setPriceBreakupModal(false)}
					totalRemovalCharges={totalRemovalCharges}
					deliveryCharges={deliveryCharges}
					totalMsrp={totalMsrp}
					discount={discount}
					totalEHF={totalEHF}
					warranty={warranty}
					subTotal={subTotal}
					total={total}
					tax5={tax5}
					tax7={tax7}
				/>
			)}

			{warrentyModal !== null && (
				<WarrantyModal
					isOpen={warrentyModal !== null}
					onClose={() => setWarrentyModal(null)}
					itemPrice={Number(cartItems[warrentyModal]?.item.price)}
					setSelectedWarranty={(warranty) => {
						setSelectedWarranties(prev => ({
							...prev,
							[warrentyModal]: warranty,
						}));
					}}
					selectedWarranty={selectedWarranties?.[warrentyModal] || null}
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
					city={city}
					state={state}
					pinCode={pinCode}
					address={address}
					setCity={setCity}
					setState={setState}
					setAddress={setAddress}
					setPinCode={setPinCode}
				/>
			}
		</>
	);
};

export default PosCartSection;
