"use client";

import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Box, Divider, Stack } from "@mantine/core";
import { AddIcon } from "@storybook/icons";
import { useRecoilState } from "recoil";
import {
	ActionIconComponent,
	ButtonComponent,
	CardComponent,
	GroupComponent,
	ScrollAreaComponent,
	SelectComponent,
	TextComponent,
	TooltipComponent,
} from "@/components";
import {
	appAccentColorRGBA,
	callCartApiAtom,
	cartDraftApi,
	currencySign,
	customerAtom,
	deleteCartApi,
	formatDate,
	getCartApi,
	getCustomerApi,
} from "@/utils";
import { ComboBoxProps } from "@/types";

export const PosCartSection = () => {
	const [customersList, setCustomersList] = useState<ComboBoxProps[]>([]);
	const [customerModalOpen, setCustomerModalOpen] = useState(false);
	const [cartItem, setCartItem] = useState<any[]>([]);
	const [subTotal, setSubTotal] = useState(0);
	const [taxOnProduct, setTaxOnProduct] = useState(0);

	const [selectedCustomer, setSelectedCustomer] = useRecoilState(customerAtom);
	const [callCart, setCallCart] = useRecoilState(callCartApiAtom);

	useEffect(() => {
		getCustomerApi(
			"",
			(data: any) => {
				const formattedCustomers = data.customers.map(
					(customer: { customer_id: string; name: string }) => ({
						value: customer.customer_id,
						label: customer.name,
					})
				);
				setCustomersList(formattedCustomers);
			},
			() => {},
			() => {}
		).then();
	}, []);

	useEffect(() => {
		if (selectedCustomer.id) {
			getCartApi(
				`?filter_type=customer&filter_query=${selectedCustomer.id}`,
				(response: any) => {
					setCartItem(response.cartItems);
					setCallCart(false);
				},
				() => {},
				() => {}
			).then();
		}
	}, [selectedCustomer, callCart]);

	useEffect(() => {
		const subtotal = calculateSubtotal();
		const taxProduct = calculateTaxOnProduct();
		console.log("taxProduct", taxProduct);
		console.log("subtotal", subtotal);
		setSubTotal(subtotal + (taxProduct > 0 ? taxProduct : 0)); // Add tax on product only if greater than 0
		setTaxOnProduct(taxProduct);
	}, [cartItem]);

	const handleCustomerChange = (option: { value: string; label: string }) => {
		setSelectedCustomer({ id: option.value, name: option.label });
	};

	const calculateSubtotal = () => {
		let subtotal = 0;
		cartItem.forEach((item) => {
			subtotal += parseInt(item.item.price, 10) * item.quantity;
		});
		return subtotal;
	};

	const calculateTax = () => {
		const subtotal = subTotal;
		return subtotal * 0.15; // Assuming 15% tax
	};

	const calculateTotal = () => {
		const subtotal = subTotal;
		const tax = calculateTax();
		return subtotal + tax;
	};

	const clearCart = () => {
		deleteCartApi(selectedCustomer.id, () => {
			setSelectedCustomer({ id: "", name: "" });
			setCallCart(true);
		}, () => {}, () => {});
	};

	const handleSaveDraft = () => {
		cartDraftApi(selectedCustomer.id, (response: any) => {
			console.log("Draft saved successfully:", response);
		}, () => {}, () => {});
	};

	const calculateTaxOnProduct = () => {
		let taxOnProductTotal = 0;

		cartItem.forEach((item) => {
			if (item.item.custom_attributes) {
				item.item.custom_attributes.forEach((attr: {
					custom_attribute: { is_tax: any; tax_type: string; type: string;
					}; attribute_value: string; }) => {
					if (attr.custom_attribute.is_tax && attr.custom_attribute.tax_type === "on_product") {
						if (attr.custom_attribute.type === "number") {
							taxOnProductTotal += parseFloat(attr.attribute_value);
						} else if (attr.custom_attribute.type === "percentage") {
							const itemPrice = parseFloat(item.item.price);
							const percentageValue = parseFloat(attr.attribute_value) / 100;
							taxOnProductTotal += itemPrice * percentageValue;
						}
					}
				});
			}
		});

		return taxOnProductTotal;
	};

	const calculateTaxOnBill = () => {
		let taxOnBill = 0;

		cartItem.forEach((item) => {
			if (item.item.custom_attributes) {
				item.item.custom_attributes.forEach((attr: {
					custom_attribute: { is_tax: any; tax_type: string; type: string; };
					attribute_value: string; }) => {
					if (attr.custom_attribute.is_tax && attr.custom_attribute.tax_type === "on_bill") {
						if (attr.custom_attribute.type === "number") {
							taxOnBill += parseFloat(attr.attribute_value);
						} else if (attr.custom_attribute.type === "percentage") {
							const itemPrice = parseFloat(item.item.price);
							const percentageValue = parseFloat(attr.attribute_value) / 100;
							const taxForItem = itemPrice * percentageValue;
							taxOnBill += taxForItem;
						}
					}
				});
			}
		});

		return taxOnBill;
	};

	return (
		<>
			<div className="w-[30%] pr-3 mt-1" style={{ height: "calc(100vh - 56px)" }}>
				<Box h={40}>
					<GroupComponent>
						<SelectComponent
							required
							data={customersList}
							value={selectedCustomer.id ?? ""}
							placeholder="Select Customer"
							setValue={(val) => {
								const option = customersList.find((c) => c.value === val);
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
				</Box>

				<Box className="mt-3" h={30}>
					<TextComponent bold size="xl" text="Order Details" />
				</Box>

				<CardComponent className="mt-3" mih={90} shadow="sm" radius="md" padding="sm" withBorder>
					<Stack gap="sm">
						<GroupComponent justify="space-between">
							<TextComponent text="Customer Name:" bold />
							<TextComponent text={selectedCustomer.name} />
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="Order Date:" bold />
							<TextComponent text={formatDate(new Date())} />
						</GroupComponent>
					</Stack>
				</CardComponent>

				<CardComponent p={0} shadow="sm" radius="md" withBorder className="my-3" style={{ height: "calc(100vh - 554px)" }}>
					<ScrollAreaComponent>
						{cartItem.map((item, index) => (
							<Box
								key={index}
								px={12}
								pt={12}
								pb={index === cartItem.length - 1 ? 0 : 6}
							>
								<Stack gap={0}>
									<GroupComponent justify="space-between" gap={0}>
										<TextComponent text={item.item.name} />
										<TextComponent text={`${currencySign} ${parseInt(item.item.price.toString(), 10) * item.quantity}`} c="green" />
									</GroupComponent>
									<TextComponent text={`x ${item.quantity}`} c="dimmed" />
									<TextComponent text={`${currencySign} ${calculateTaxOnProduct()}`} />
									{index !== cartItem.length - 1 && <Divider my={0} variant="dashed" p={0} py={0} />}
								</Stack>
							</Box>
						))}
					</ScrollAreaComponent>
				</CardComponent>

				<CardComponent padding="sm" shadow="sm" radius="md" withBorder style={{ height: 150 }}>
					<Stack gap="sm">
						<GroupComponent justify="space-between">
							<TextComponent text="Sub Total:" size="sm" />
							<TextComponent text={`${currencySign} ${subTotal}`} bold size="sm" />
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="Tax (15%):" size="sm" />
							<TextComponent text={`${currencySign} ${calculateTax()}`} bold size="sm" />
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="On Bill:" size="sm" />
							<TextComponent text={`${currencySign} ${calculateTaxOnBill()}`} bold size="sm" />
						</GroupComponent>
						<Divider my={0} variant="dashed" p={0} py={0} />
						<GroupComponent justify="space-between">
							<TextComponent text="Total:" bold />
							<TextComponent text={`${currencySign} ${calculateTotal()}`} bold />
						</GroupComponent>
					</Stack>
				</CardComponent>

				<Box h={40} className="mt-3">
					<GroupComponent>
						<TooltipComponent label="Clear cart">
							<ActionIconComponent c="red" maw={36} h={36} onClick={clearCart}>
								<RiDeleteBin6Line />
							</ActionIconComponent>
						</TooltipComponent>
						<GroupComponent grow justify="space-evenly" w="calc(100% - 50px)">
							<ButtonComponent color={appAccentColorRGBA} title="Save Draft" onClick={handleSaveDraft} />
							<ButtonComponent title="Checkout" />
						</GroupComponent>
					</GroupComponent>
				</Box>
			</div>
		</>
	);
};

export default PosCartSection;
