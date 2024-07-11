"use client";

import { FiShoppingCart } from "react-icons/fi";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
	BoxComponent, ButtonComponent,
	CardComponent,
	CenterComponent, DividerComponent,
	GroupComponent, ModalComponent, ScrollAreaComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
} from "@/components";
import {
	appAccentColorRGBA,
	cartAtom, cartIdAtom,
	cartItemsAtom,
	currencySign,
	customerAtom,
	formatDate,
	toTitleCase,
} from "@/utils";
import { CartItemModel, CartModel } from "@/models";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	subTotal: number;
}

const InvoiceDetailModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		subTotal,
	} = props;
	const setCartId = useSetRecoilState(cartIdAtom);
	const [customer, setCustomer] = useRecoilState(customerAtom);
	const setCart = useSetRecoilState<CartModel | null>(cartAtom);
	const [cartItems, setCartItems] = useRecoilState<Array<CartItemModel>>(cartItemsAtom);

	const calculateTaxOnProduct = (attr: any, price: any, quantity: any) => {
		if (attr) {
			if (attr.custom_attribute.is_tax && attr.custom_attribute.tax_type === "on_product") {
				if (attr.custom_attribute.type === "number") {
					const attributeVal = Number(attr.attribute_value);
					return attributeVal * quantity;
				}
				if (attr.custom_attribute.type === "percentage") {
					const itemPrice = Number(price);
					return ((itemPrice / 100) * Number(attr.attribute_value)) * Number(quantity);
				}
				return null;
			}
			return null;
		}
		return null;
	};

	const calculateTaxOnBill = () => {
		let taxOnBill = 0;

		cartItems.forEach((item) => {
			if (item.item.custom_attributes) {
				item.item.custom_attributes.forEach((attr: {
					custom_attribute: { is_tax: any; tax_type: string; type: string; };
					attribute_value: string;
				}) => {
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

	const handleCloseModal = () => {
			setCartItems([]);
			setCart(null);
			setCartId("");
			setCustomer({ id: "", name: "" });
			onClose();
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={handleCloseModal}
			className="border-grey-800"
			title={<TitleComponent title="Invoice Detail" />}
		>

			<CardComponent className="mt-3" mih={90} shadow="sm" radius="md" padding="sm" withBorder>
				<StackComponent gap="sm">
					<GroupComponent justify="space-between">
						<TextComponent text="Customer Name:" bold />
						<TextComponent text={customer.name ? customer.name : "N/A"} />
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
				{
					cartItems.length === 0 ?
						<CenterComponent h="100%">
							<FiShoppingCart />
							<TextComponent text="Cart is Empty!" ml={5} />
						</CenterComponent>
						:
						<ScrollAreaComponent>
							{
								cartItems.map((item, index) => (
									<BoxComponent
										key={index}
										px={12}
										py={8}
										pb={index === cartItems.length - 1 ? 0 : 12}
									>
										<StackComponent gap="sm" mb="10" >
											<GroupComponent justify="space-between">
												<StackComponent
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
											{
												item.item.custom_attributes.map(ca => (
													<GroupComponent justify="space-between">
														<TextComponent
															lh={1}
															fz={12}
															text={
																toTitleCase(
																	ca.custom_attribute.name
																)
															}
														/>
														<TextComponent
															lh={1}
															fz={12}
															text={
																`${currencySign} 
																${calculateTaxOnProduct(
																	ca,
																	item.item.price,
																	item.quantity
																)}`
															}
														/>
													</GroupComponent>
												))
											}
											{index !== cartItems.length - 1 &&
												<DividerComponent my={0} mt={6} variant="dashed" p={0} py={0} />}
										</StackComponent>
									</BoxComponent>
								))}
						</ScrollAreaComponent>
				}
			</CardComponent>

			<CardComponent padding="sm" shadow="sm" radius="md" withBorder style={{ height: "auto" }}>
				<StackComponent gap="sm">
					<GroupComponent justify="space-between">
						<TextComponent text="Sub Total:" size="sm" />
						<TextComponent text={`${currencySign} ${subTotal}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="On Bill:" size="sm" />
						<TextComponent text={`${currencySign} ${calculateTaxOnBill()}`} bold size="sm" />
					</GroupComponent>
					<DividerComponent my={0} variant="dashed" p={0} py={0} />
					<GroupComponent justify="space-between">
						<TextComponent text="Total:" bold />
						<TextComponent text={`${currencySign} ${subTotal}`} bold />
					</GroupComponent>
				</StackComponent>
			</CardComponent>

			<BoxComponent h={60} className="mt-3">
				<GroupComponent grow justify="end">
					<GroupComponent grow justify="space-evenly" style={{ flexGrow: 1 }}>
						<ButtonComponent
							title="Close"
							variant="subtle"
							color={appAccentColorRGBA}
							onClick={handleCloseModal}
						/>
						<ButtonComponent title="Print" />
					</GroupComponent>
				</GroupComponent>
			</BoxComponent>
		</ModalComponent>
	);
};

export default InvoiceDetailModal;
