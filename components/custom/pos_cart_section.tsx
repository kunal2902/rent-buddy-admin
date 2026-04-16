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
	ImageComponent,
	NumberInputComponent,
	ScrollAreaComponent,
	SelectComponent,
	SpoilerComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
	TooltipComponent,
} from "@/components";
import {
	cartAtom,
	cartIdAtom,
	cartItemsAtom,
	cartPaymentMethodAtom,
	checkoutApi,
	currencySign,
	customerAtom,
	deleteCartApi,
	formatDate,
	getCustomerApi, getReportsAPI,
	getWarrantyApi,
	logoutUser,
	paymentOptions, updateItemApi, updateReportApi,
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
import { WarrantyModel } from "@/models/warranty_modal";
import AdditionalNoteModal from "@/components/custom/additional_note";
import { DigitalSignatureModal } from "@/components/custom/digital_signature";

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
	const [exchangeDifference, setExchangeDifference] = useState<number>(0);

	const [additionNoteModal, setAdditionalNoteModal] =
		useState<boolean>(false);
	const [warrentyModal, setWarrentyModal] = useState<number | null>(null);
	const [orderDate, setOrderDate] = useState<string>("");

	const [customersList, setCustomersList] = useState<ComboBoxProps[]>([]);
	const [selectedWarranties, setSelectedWarranties] = useState<{
		[key: number]: { duration: string; price: number };
	} | null>(null);
	console.log("selectedWarranties", selectedWarranties);
	const [totalEHF, setTotalEHF] = useState<number>(0);
	const [address, setAddress] = useState<string | undefined>("");
	const [note, setNote] = useState<string | undefined>("");
	const [city, setCity] = useState<string | undefined>("");
	const [state, setState] = useState<string | undefined>("");
	const [pinCode, setPinCode] = useState<string | undefined>("");
	const [fullAddress, setFullAddress] = useState<string | undefined>("");
	const [totalRemovalCharges, setTotalRemovalCharges] = useState<
		number | undefined
	>(0);
	const [deliveryCharges, setDeliveryCharges] = useState<
		string | number | undefined
	>(0);
	const [removalCharges, setRemovalCharges] = useState<
		Record<number, number>
	>({});
	const [ehfCharges, setEhfCharges] = useState<Record<number, number>>({});
	const [totalMsrp, setTotalMsrp] = useState<number>(0);
	const [warrantiesList, setWarrantiesList] = useState<WarrantyModel[]>([]);
	console.log("warrantiesList", warrantiesList);

	const [total, setTotal] = useState(0);
	const [tax5, setTax5] = useState(0);
	const [tax7, setTax7] = useState(0);

	const [cartId, setCartId] = useRecoilState(cartIdAtom);
	const [paymentMethod, setPaymentMethod] = useRecoilState(
		cartPaymentMethodAtom,
	);
	const setCart = useSetRecoilState<CartModel | null>(cartAtom);
	const [selectedCustomer, setSelectedCustomer] =
		useRecoilState(customerAtom);

	const [cartItems, setCartItems] =
		useRecoilState<Array<CartItemModel>>(cartItemsAtom);
	const selectComponentKey = selectedCustomer.id + selectedCustomer.name;

	const [isExchangeMode, setIsExchangeMode] = useState(false);
	const [exchangeData, setExchangeData] = useState<any>(null);
	const [signatureModalOpen, setSignatureModalOpen] = useState(false);
	const [customerSignature, setCustomerSignature] = useState(null);
	const [manualExchangeBalance, setManualExchangeBalance] = useState<number>(0);

	useEffect(() => {
		const storedExchangeData = localStorage.getItem("exchangeData");
		if (storedExchangeData) {
			const parsedData = JSON.parse(storedExchangeData);

			// Fetch the full report data using the stored ID
			getReportsAPI(
				`invoice_id=${parsedData.id}`,
				(data) => {
					// eslint-disable-next-line max-len
					const originalInvoice = data.reports.find((report:any) => report.invoice_id === parsedData.id);

					if (originalInvoice) {
						const fullExchangeData = {
							...parsedData,
							originalInvoice,
						};

						setExchangeData(fullExchangeData);
						setIsExchangeMode(true);

						// Set customer from original invoice
						if (originalInvoice.customer) {
							setSelectedCustomer({
								// eslint-disable-next-line max-len
								id: originalInvoice.customer.customer_id || originalInvoice.customer.id,
								name: originalInvoice.customer.name,
							});
						}

						// Set address from original invoice
						if (originalInvoice.transaction_detail) {
							const detail = originalInvoice.transaction_detail;
							setAddress(detail.address || "");
							setCity(detail.city || "");
							setState(detail.state || "");
							setPinCode(detail.pinCode || "");
							setDeliveryCharges(detail.deliveryCharges || 0);
						}
					} else {
						ShowNotification("Original invoice not found", "error");
					}

					// Clean up localStorage after processing
					localStorage.removeItem("exchangeData");
				},
				(error) => {
					console.error("Failed to fetch exchange data:", error);
					ShowNotification("Failed to load exchange data", "error");
					localStorage.removeItem("exchangeData");
				},
				() => {
					logoutUser(router);
				}
			);

			return;
		}

		const storedExchangeState = localStorage.getItem("exchangeState");
		if (storedExchangeState) {
			const parsedState = JSON.parse(storedExchangeState);

			setIsExchangeMode(parsedState.isExchangeMode);
			setExchangeData(parsedState.exchangeData);
			setCartItems(parsedState.cartItems || []);
			setSelectedCustomer(parsedState.selectedCustomer || { id: "", name: "" });
			setPaymentMethod(parsedState.paymentMethod || "");
			setAddress(parsedState.address || "");
			setCity(parsedState.city || "");
			setState(parsedState.state || "");
			setPinCode(parsedState.pinCode || "");
			setDeliveryCharges(parsedState.deliveryCharges || 0);
			setNote(parsedState.note || "");
		}
	}, []);

	useEffect(() => {
		if (cartItems.length > 0 && !cartId && selectedCustomer.id) {
			// Create a new cart when items exist but no cartId
			const createCartBody = {
				customer_id: selectedCustomer.id,
				label: "Draft",
			};

			upsertCartApi(
				createCartBody,
				(response: any) => {
					setCartId(response.cart.id);
					setCart(response.cart);
				},
				(err: any) => {
					ShowNotification(err.error, "error");
				},
				() => {
					logoutUser(router);
				}
			).then();
		}
	}, [cartItems, cartId, selectedCustomer.id]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const total = Object.values(removalCharges).reduce(
			(sum, charge) => sum + (charge || 0),
			0,
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
		getWarrantyApi(
			"",
			(data: any) => {
				setWarrantiesList(data.warranty);
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

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const calculateTotalWarrantyPrice = (selectedWarranties: {
		[key: number]: { duration: string; price: number };
	}): number => Object.values(selectedWarranties)
			.reduce((sum, { price }) => sum + price, 0);

	const getOriginalItemTotal = () => {
		if (!exchangeData || !exchangeData.originalInvoice.invoice_items) {
			return 0;
		}

		// eslint-disable-next-line @typescript-eslint/no-shadow
		return exchangeData.originalInvoice.invoice_items.reduce((total: number, item: any) =>
				// eslint-disable-next-line max-len,no-mixed-spaces-and-tabs
			 total + (Number(item.selling_price || item.price || 0) * Number(item.quantity || 1)),
			// eslint-disable-next-line no-mixed-spaces-and-tabs
		 0);
	};

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const totalMsrp = calculateMsrp();
		const totalItemQuantity = calculateItemQuantity();
		const warrantyTotal = calculateTotalWarrantyPrice(selectedWarranties || {});

		const calculatedTax5 = (totalItemQuantity * 5) / 100;
		const calculatedTax7 = (totalItemQuantity * 7) / 100;

		const calculateSubTotal =
			totalMsrp +
			calculatedTax5 +
			calculatedTax7 +
			Number(totalRemovalCharges || 0) +
			Number(deliveryCharges || 0) +
			warrantyTotal +
			Number(totalEHF || 0);

		let calculatedTotal = calculateSubTotal - (totalMsrp - totalItemQuantity);

		if (isExchangeMode && exchangeData) {
			const newItemTotal = totalItemQuantity;
			const originalItemTotal = getOriginalItemTotal();
			// eslint-disable-next-line @typescript-eslint/no-shadow,max-len
			const calculatedExchangeDifference = newItemTotal - originalItemTotal;
			// eslint-disable-next-line max-len
			const effectiveExchangeDifference = manualExchangeBalance !== 0 ? manualExchangeBalance : calculatedExchangeDifference;

			setExchangeDifference(effectiveExchangeDifference);

			if (exchangeDifference >= 0) {
				calculatedTotal = effectiveExchangeDifference + calculatedTax5 + calculatedTax7 +
					Number(totalRemovalCharges || 0) + Number(deliveryCharges || 0) +
					warrantyTotal + Number(totalEHF || 0);
			} else {
				calculatedTotal = effectiveExchangeDifference;
			}
		} else {
			setExchangeDifference(0);
		}

		setTotalMsrp(totalMsrp);
		setTax5(calculatedTax5);
		setTax7(calculatedTax7);
		setTotal(calculatedTotal);
		setWarranty(warrantyTotal);
		setSubTotal(calculateSubTotal);
		setDiscount(totalMsrp - totalItemQuantity);
	}, [
		cartItems,
		removalCharges,
		deliveryCharges,
		totalMsrp,
		selectedWarranties,
		totalRemovalCharges,
		totalEHF,
		isExchangeMode,
		exchangeData,
		manualExchangeBalance,
	]);

	const handleExchangeBalanceChange = (value:string | number) => {
		setManualExchangeBalance(Number(value) || 0);
	};

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
		// eslint-disable-next-line @typescript-eslint/no-shadow
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

	const resetCartStates = () => {
		setCartItems([]);
		setCartId("");
		setCart(null);
		setSelectedCustomer({
			id: "",
			name: "",
		});
		setPaymentMethod("");
		setFullAddress("");
		setOrderDate("");
		setPinCode("");
		setCity("");
		setState("");
		setAddress("");
		setNote("");
		setExchangeDifference(0);
		setManualExchangeBalance(0);
		setDiscount(0);
		setTotal(0);
		setSubTotal(0);
		setWarranty(0);
		setTax5(0);
		setTax7(0);
		setTotalMsrp(0);
		setTotalEHF(0);
		setTotalRemovalCharges(0);
		setDeliveryCharges(0);
		setRemovalCharges({});
		setEhfCharges({});
		setSelectedWarranties(null);

		// Reset exchange mode states
		setIsExchangeMode(false);
		setExchangeData(null);

		// Clear localStorage
		localStorage.removeItem("exchangeData");
		localStorage.removeItem("exchangeState");
	};

	const clearCart = () => {
		if (!cartId) {
			// If no cartId, just clear the local state
			resetCartStates();
			ShowNotification("Cart cleared", "success");
			return;
		}

		deleteCartApi(
			cartId,
			() => {
				resetCartStates();
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

	const ensureCartExists = async () => {
		if (!cartId && selectedCustomer.id) {
			const createCartBody = {
				customer_id: selectedCustomer.id,
				label: "Draft",
			};

			try {
				const response = await upsertCartApi(
					createCartBody,
					(res: any) => res,
					(err: any) => {
						throw new Error(err.error);
					},
					() => {
						logoutUser(router);
					}
				);
				if (typeof response === "object" && response !== null && "cart" in response) {
					setCartId(response.cart?.id);
					setCart(response.cart);
					return response.cart?.id;
				}
			} catch (error) {
				ShowNotification("Failed to create cart", "error");
				return null;
			}
		}
		return cartId;
	};

	const ehfFees: Record<string, number> = {
		"Fridges/Freezers/AC": 6.5,
		Dishwashers: 2.0,
		"Washer/Dryer/Range/Stacker/Laundry Paris": 2.0,
		Microwaves: 5.0,
		"OTR/Hoodfan": 2.0,
		"DVD/Bluray/OLED/Sound Bar": 2.5,
	};

	const findCategory = (categoryName: string): string | undefined =>
		Object.keys(ehfFees).find((key) =>
			key.toLowerCase().includes(categoryName?.toLowerCase()),
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
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const total = cartItems.reduce((sum, item, index) => {
			const calculatedEHF =
				ehfCharges[index] !== undefined
					? ehfCharges[index]
					: calculateEHF(item.item?.category?.name, item?.quantity);
			return sum + calculatedEHF;
		}, 0);

		setTotalEHF(total);
	}, [ehfCharges, cartItems]);

	const handleCheckout = async () => {
		if (cartItems.length === 0) {
			ShowNotification("Please select item first!", "error");
			return;
		}

		if (!selectedCustomer.id) {
			ShowNotification("Please select customer first!", "error");
			return;
		}

		if (!paymentMethod) {
			ShowNotification("Please select payment method first!", "error");
			return;
		}

		if (!address) {
			ShowNotification("Please select shipping address first!", "error");
			return;
		}

		setLoading(true);

		try {
			// Ensure cart exists before checkout
			const currentCartId = await ensureCartExists();

			if (!currentCartId) {
				setLoading(false);
				return;
			}

			// Update cart with payment method
			const cartUpdateBody = {
				id: currentCartId,
				customer_id: selectedCustomer.id,
				label: "Purchased!",
				payment_method: paymentMethod,
			};

			await new Promise((resolve, reject) => {
				upsertCartApi(
					cartUpdateBody,
					(response) => resolve(response),
					(err) => reject(err),
					() => {
						logoutUser(router);
						reject(new Error("Unauthorized"));
					}
				);
			});

			if (isExchangeMode && exchangeData) {
				try {
					console.log("Processing exchange - updating item quantities");

					const originalInvoiceItems = exchangeData.originalInvoice?.invoice_items || [];

					for (const originalItem of originalInvoiceItems) {
						const updateData = {
							increment_stock: Number(originalItem.quantity),
						};

						console.log(`Increasing stock for item ${originalItem.item_id} by ${originalItem.quantity}`);

						await new Promise((resolve, reject) => {
							updateItemApi(
								originalItem.item_id.toString(),
								updateData,
								(data) => {
									console.log(`Successfully updated stock for item ${originalItem.item_id}`);
									resolve(data);
								},
								(error) => {
									console.error(`Failed to update stock for item ${originalItem.item_id}:`, error);
									reject(error);
								},
								() => {
									logoutUser(router);
									reject(new Error("Unauthorized"));
								}
							);
						});
					}

					// 2. Decrease quantity for new exchange items (current cart items)
					for (const cartItem of cartItems) {
						// Only update stock - remove non-existent fields
						const updateData = {
							decrement_stock: Number(cartItem.quantity),
						};

						console.log(`Decreasing stock for item ${cartItem.item.item_id} by ${cartItem.quantity}`);

						await new Promise((resolve, reject) => {
							updateItemApi(
								cartItem.item.item_id.toString(),
								updateData,
								(data) => {
									console.log(`Successfully updated stock for item ${cartItem.item.item_id}`);
									resolve(data);
								},
								(error) => {
									console.error(`Failed to update stock for item ${cartItem.item.item_id}:`, error);
									reject(error);
								},
								() => {
									logoutUser(router);
									reject(new Error("Unauthorized"));
								}
							);
						});
					}

					// 3. Update the original report/invoice status
					const originalReportUpdateData = {
						is_returned: false,
						is_exchanged: true,
						exchanged_at: new Date().toISOString(),
					};

					console.log("Updating original invoice status");

					await new Promise((resolve, reject) => {
						updateReportApi(
							exchangeData.originalInvoice.invoice_id,
							originalReportUpdateData,
							(data) => {
								console.log("Successfully updated original invoice status");
								resolve(data);
							},
							(error) => {
								console.error("Failed to update original invoice status:", error);
								reject(error);
							},
							() => {
								logoutUser(router);
								reject(new Error("Unauthorized"));
							}
						);
					});

					console.log("Exchange item updates completed successfully");
				} catch (error) {
					console.error("Failed to update items for exchange:", error);
					setLoading(false);
					// ShowNotification(`Failed to process exchange: ${error?.message}`, "error");
					return;
				}
			}

			// Prepare checkout body
			const checkoutBody = {
				cartId: currentCartId,
				details: {
					totalRemovalCharges,
					deliveryCharges,
					paymentMethod,
					fullAddress,
					totalEHF,
					subTotal,
					total,
					note,
					tax5,
					tax7,
					warranty,
					isExchange: isExchangeMode,
					originalInvoiceId: exchangeData?.originalInvoice?.invoice_id || null,
					exchangeAmount: isExchangeMode ? total : null,
				},
			};

			console.log("Calling checkout API with body:", checkoutBody);
			// eslint-disable-next-line max-len
			const checkoutResult: { invoice: { created_at: string } } = await new Promise((resolve, reject) => {
				checkoutApi(
					checkoutBody,
					(res) => {
						console.log("Checkout API successful:", res);
						resolve(res);
					},
					(err) => {
						console.error("Checkout API failed:", err);
						reject(err);
					},
					() => {
						console.error("Checkout API unauthorized");
						logoutUser(router);
						reject(new Error("Unauthorized"));
					},
				);
			});

			console.log("Checkout completed successfully:", checkoutResult);
			setLoading(false);
			setSignatureModalOpen(true);
			setOrderDate(checkoutResult?.invoice.created_at);

			const successMessage = isExchangeMode
				? "Exchange completed successfully"
				: "Checkout completed successfully";
			ShowNotification(successMessage, "success");
		} catch (error) {
			console.error("Checkout process failed:", error);
			setLoading(false);
		}
	};

	const truncateText = (text: string, maxLength: number): string =>
		text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

	const handlePaymentMethodChange = (option: ComboBoxProps) => {
		setPaymentMethod(option.value);
	};

	const handleRemovalChargeChange = (index: number, value: number) => {
		setRemovalCharges((prev) => ({
			...prev,
			[index]: value,
		}));
	};

	const handleEhfChargeChange = (index: number, value: number) => {
		setEhfCharges((prev) => ({
			...prev,
			[index]: value,
		}));
	};

	const handleSignatureConfirm = (signatureDataURL:any) => {
		setCustomerSignature(signatureDataURL);
		localStorage.setItem("customerSignature", signatureDataURL);
		setSignatureModalOpen(false);
		setInvoiceDialogOpen(true);
	};

	const handleSignatureSkip = () => {
		setSignatureModalOpen(false);
		setInvoiceDialogOpen(true);
	};

	const handleSignatureClose = () => {
		setSignatureModalOpen(false);
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

				<ScrollAreaComponent
					type="always"
					pt={12}
					h="calc(100% - 80px)"
				>
					<CardComponent
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
							{address === "" &&
							city === "" &&
							state === "" &&
							pinCode === "" ? (
								<GroupComponent justify="end">
									<ButtonComponent
										px={0}
										h={16}
										variant="transparent"
										title="Add Shipping Address"
										onClick={() => setOpenShipToModal(true)}
									/>
								</GroupComponent>
							) : (
								<GroupComponent justify="space-between">
									<TextComponent text="Ship To:" bold />
									<TooltipComponent
										position="bottom-start"
										label={fullAddress}
									>
										<TextComponent
											text={truncateText(
												fullAddress || "",
												35,
											)}
										/>
									</TooltipComponent>
									<ActionIconComponent
										onClick={() => setOpenShipToModal(true)}
										size="md"
									>
										<MdOutlineEdit size={18} />
									</ActionIconComponent>
								</GroupComponent>
							)}
						</StackComponent>
					</CardComponent>

					<CardComponent
						p={0}
						shadow="sm"
						radius="md"
						withBorder
						className="mt-3"
					>
						{cartItems.length === 0 ? (
							<CenterComponent h={200}>
								<FiShoppingCart />
								<TextComponent text="Cart is Empty!" ml={5} />
							</CenterComponent>
						) : (
							<>
								{cartItems.map((item, index) => (
									<BoxComponent
										key={index}
										px={20}
										py={8}
										pb={
											index === cartItems.length - 1
												? 0
												: 12
										}
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
														<TooltipComponent
															position="bottom-start"
															label={
																item.item.name
															}
														>
															<TitleComponent
																fz={14}
																title={truncateText(
																	item.item
																		.name,
																	30,
																)}
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
																10,
															)} x ${item.quantity}`}
														/>
														<TextComponent
															c="gray"
															fz={12}
															td="line-through"
															text={`${currencySign} ${parseInt(
																item.item.msrp.toString(),
																10,
															)}`}
														/>
													</GroupComponent>
												</StackComponent>
											</GroupComponent>

											<GroupComponent
												justify="space-between"
												gap={0}
											>
												<GroupComponent
													justify="space-between"
													my={5}
													w="48%"
												>
													<TextComponent
														lh={1}
														fz={12}
														text="EHF"
													/>
													<NumberInputComponent
														w={100}
														min={0}
														required
														size="xs"
														prefix="$ "
														value={
															ehfCharges[index] ??
															calculateEHF(
																item.item
																	?.category
																	?.name,
																item.quantity,
															)
														}
														setValue={(value) =>
															handleEhfChargeChange(
																index,
																Number(value),
															)
														}
													/>
												</GroupComponent>

												<DividerComponent
													orientation="vertical"
													maw="4%"
												/>

												<GroupComponent
													justify="space-between"
													my={5}
													w="48%"
												>
													<TextComponent
														lh={1}
														fz={12}
														text="Removal"
													/>
													<NumberInputComponent
														w={100}
														min={0}
														required
														size="xs"
														prefix="$ "
														value={
															removalCharges[
																index
															] || 0
														}
														setValue={(value) =>
															handleRemovalChargeChange(
																index,
																Number(value),
															)
														}
													/>
												</GroupComponent>
											</GroupComponent>

											{/* Warranty Logic */}
											{selectedWarranties?.[index] ? (
												<GroupComponent
													justify="space-between"
													my={5}
												>
													<TextComponent
														lh={1}
														fz={12}
														text={`${selectedWarranties[index]?.duration} Warranty: `}
													/>
													<GroupComponent justify="end">
														<TextComponent
															lh={1}
															fz={12}
															text={`$ ${(selectedWarranties[index]?.price ?? 0) * item.quantity}`}
														/>
														<ActionIconComponent
															onClick={() =>
																setWarrentyModal(
																	index,
																)
															}
															size="md"
														>
															<MdOutlineEdit
																size={18}
															/>
														</ActionIconComponent>
													</GroupComponent>
												</GroupComponent>
											) : (
												<GroupComponent justify="end">
													<ButtonComponent
														px={0}
														my={5}
														h={16}
														variant="transparent"
														title="Add Warranty"
														onClick={() =>
															setWarrentyModal(
																index,
															)
														}
													/>
												</GroupComponent>
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
							</>
						)}
					</CardComponent>

					<CardComponent
						padding="sm"
						shadow="sm"
						radius="md"
						withBorder
						className="mt-3"
					>
						<StackComponent gap="sm">
							<GroupComponent justify="space-between">
								<TextComponent
									text="Delivery Charges:"
									size="sm"
									bold
								/>
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

							{isExchangeMode && (
								<>
									<GroupComponent justify="space-between">
										<TextComponent
											text="Exchange Balance:"
											bold
										/>
										<NumberInputComponent
											w={120}
											size="sm"
											prefix="$ "
											allowNegative
											title="Exchange Balance"
											value={exchangeDifference}
											setValue={handleExchangeBalanceChange}
											placeholder="Exchange Balance"
										/>
									</GroupComponent>
									<DividerComponent
										my={0}
										variant="dashed"
										p={0}
										py={0}
									/>
								</>
							)}

							<GroupComponent justify="space-between">
								<TextComponent
									text="Total:"
									bold
								/>
								<StackComponent gap={0} align="end">
									<TextComponent
										text={`${currencySign} ${Math.abs(total).toFixed(2)}`}
										bold
										color="dark"
									/>
								</StackComponent>
							</GroupComponent>

							<GroupComponent
								justify={
									note === "" ? "space-between" : "right"
								}
							>
								{note === "" && (
									<ButtonComponent
										h={16}
										my={5}
										px={0}
										variant="transparent"
										title="Add Additional Note"
										onClick={() =>
											setAdditionalNoteModal(true)
										}
									/>
								)}

								<ButtonComponent
									h={16}
									my={5}
									px={0}
									variant="transparent"
									title="View Price Breakup"
									onClick={() => setPriceBreakupModal(true)}
								/>
							</GroupComponent>
							{note !== "" && !additionNoteModal && (
								<SpoilerComponent
									hideLabel="Less"
									showLabel="More"
								>
									{note}
									<TooltipComponent
										position="bottom-start"
										label="Edit Additional Note"
									>
										<ActionIconComponent
											onClick={() =>
												setAdditionalNoteModal(true)
											}
											size="md"
										>
											<MdOutlineEdit size={18} />
										</ActionIconComponent>
									</TooltipComponent>
								</SpoilerComponent>
							)}
						</StackComponent>
					</CardComponent>
				</ScrollAreaComponent>

				<BoxComponent h={60} className="mt-3 mb-2">
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
								title={
									isExchangeMode
										? "Complete Exchange"
										: "Checkout"
								}
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
					onClose={() => {
						setInvoiceDialogOpen(false);
						resetCartStates();
						setCustomerSignature(null);
						localStorage.removeItem("customerSignature");
					}}
					setTotalRemovalCharges={setTotalRemovalCharges}
					totalRemovalCharges={totalRemovalCharges}
					setDeliveryCharges={setDeliveryCharges}
					deliveryCharges={deliveryCharges}
					fullAddress={fullAddress}
					setAddress={setAddress}
					setPinCode={setPinCode}
					orderDate={orderDate}
					totalEHF={totalEHF}
					warranty={warranty}
					discount={discount}
					totalMsrp={totalMsrp}
					setState={setState}
					subTotal={subTotal}
					setCity={setCity}
					total={total}
					tax5={tax5}
					tax7={tax7}
					note={note}
					customerSignature={customerSignature!}
					isExchangeMode={isExchangeMode}
					originalItemTotal={isExchangeMode ? getOriginalItemTotal() : 0}
					exchangeDifference={exchangeDifference}
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
					isExchangeMode={isExchangeMode}
					originalItemTotal={isExchangeMode ? getOriginalItemTotal() : 0}
					exchangeDifference={exchangeDifference}
				/>
			)}

			{setAdditionalNoteModal && (
				<AdditionalNoteModal
					isOpen={additionNoteModal}
					onClose={() => setAdditionalNoteModal(false)}
					setNote={setNote}
					note={note}
				/>
			)}

			{warrentyModal !== null && (
				<WarrantyModal
					isOpen
					warrantiesList={warrantiesList}
					onClose={() => setWarrentyModal(null)}
					itemPrice={Number(cartItems[warrentyModal]?.item.price)}
					setSelectedWarranty={(newWarranty:any) => {
						setSelectedWarranties((prev) => ({
							...prev,
							[warrentyModal]: newWarranty,
						}));
					}}
					selectedWarranty={
						selectedWarranties?.[warrentyModal] || null
					}
				/>
			)}

			{openAddModal && (
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
			)}

			{openShipToModal && (
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
			)}

			{signatureModalOpen && (
				<DigitalSignatureModal
					isOpen={signatureModalOpen}
					onClose={handleSignatureClose}
					onConfirm={handleSignatureConfirm}
					onSkip={handleSignatureSkip}
					customerName={selectedCustomer?.name}
				/>
			)}
		</>
	);
};

export default PosCartSection;
