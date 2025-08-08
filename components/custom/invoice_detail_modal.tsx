"use client";

import React, { Dispatch, SetStateAction } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
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
	cartItemsAtom, cartPaymentMethodAtom,
	currencySign,
	customerAtom,
	formatDate,
	toTitleCase,
} from "@/utils";
import { CartItemModel, CartModel } from "@/models";
import DeliveryButton from "@/components/custom/delivery_button";
import InvoiceButton from "@/components/custom/invoice_button";
import PickupButton from "@/components/custom/pickup_button";

interface Props {
	tax5:number;
	tax7: number;
	total: number;
	warranty: number;
	isOpen: boolean;
	subTotal: number;
	discount: number;
	totalMsrp: number;
	orderDate: string;
	onClose: () => void;
	note: string | undefined;
	totalEHF: number | undefined;
	fullAddress:string | undefined;
	totalRemovalCharges: number | undefined;
	deliveryCharges: string | number | undefined;
	setDeliveryCharges: Dispatch<SetStateAction<number | undefined | string>>;
	setAddress: Dispatch<SetStateAction<undefined | string>>;
	setPinCode: Dispatch<SetStateAction<undefined | string>>;
	setState: Dispatch<SetStateAction<undefined | string>>;
	setCity: Dispatch<SetStateAction<undefined | string>>;
	setTotalRemovalCharges: Dispatch<SetStateAction<number | undefined>>;
	customerSignature: string | undefined;
	isExchangeMode:boolean;
originalItemTotal: number;
exchangeDifference: number;
}

const InvoiceDetailModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		total,
		note,
		tax5,
		tax7,
		subTotal,
		totalEHF,
		orderDate,
		fullAddress,
		totalMsrp,
		discount,
		deliveryCharges,
		totalRemovalCharges,
		setDeliveryCharges,
		setCity,
		setPinCode,
		setAddress,
		setState,
		setTotalRemovalCharges,
		warranty,
		customerSignature,
		isExchangeMode,
		originalItemTotal,
		exchangeDifference,
	} = props;
	const setCartId = useSetRecoilState(cartIdAtom);
	const [customer, setCustomer] = useRecoilState(customerAtom);
	const [paymentMethod, setPaymentMethod] = useRecoilState(cartPaymentMethodAtom);
	const resetPaymentMethod = useResetRecoilState(cartPaymentMethodAtom);
	const setCart = useSetRecoilState<CartModel | null>(cartAtom);
	const [cartItems, setCartItems] = useRecoilState<Array<CartItemModel>>(cartItemsAtom);

	const handleCloseModal = () => {
		setCustomer({ id: "", name: "" });
		setPaymentMethod("");
		setTotalRemovalCharges(0);
		setCartItems([]);
		setDeliveryCharges(0);
		setCart(null);
		setCartId("");
		resetPaymentMethod();
		setPinCode("");
		setAddress("");
		setState("");
		setCity("");
		onClose();
	};

	const truncateText = (text: string, maxLength: number): string => text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

	return (
		<ModalComponent
			opened={isOpen}
			onClose={handleCloseModal}
			className="border-grey-800"
			size="lg"
			title={<TitleComponent title="Invoice Detail" />}
		>

			<CardComponent className="mt-1" mih={90} shadow="sm" radius="md" padding="sm" withBorder>
				<StackComponent gap="sm">
					<GroupComponent justify="space-between">
						<TextComponent text="Customer Name:" bold />
						<TextComponent text={customer.name} />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Order Date:" bold />
						<TextComponent text={formatDate(orderDate)} />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Paynebt method:" bold />
						<TextComponent text={paymentMethod} />
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
										<StackComponent gap="sm" mb="10">
											<GroupComponent justify="space-between">
												<StackComponent
													gap={0}
													style={{ flexGrow: 1 }}
												>
													<GroupComponent justify="space-between">
														<TitleComponent
															fz={14}
															title={truncateText(item.item.name, 30)}
														/>

														<TitleComponent
															fz={14}
															c="green"
															title={`${currencySign} ${parseInt(item.item.price.toString(), 10) * item.quantity}`}
														/>
													</GroupComponent>
													<GroupComponent justify="space-between">
														<TextComponent
															c="gray"
															fz={12}
															text={`${currencySign} ${parseInt(item.item.price.toString(), 10)} x ${item.quantity}`}
														/>
														<TextComponent
															td="line-through"
															c="gray"
															fz={12}
															text={`${currencySign} ${parseInt(item.item.msrp.toString(), 10)}`}
														/>
													</GroupComponent>
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
																`${currencySign}`}
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

			<CardComponent
				padding="sm"
				shadow="sm"
				radius="md"
				withBorder
				style={{ height: "auto" }}
			>
				<StackComponent gap="sm">
					<GroupComponent justify="space-between">
						<TextComponent text="MSRP:" size="sm" bold />
						<TextComponent text={`${currencySign} ${totalMsrp.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="EHF:" size="sm" bold />
						<TextComponent text={`${currencySign} ${totalEHF?.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Delivery Charges:" size="sm" bold />
						<TextComponent text={`${currencySign} ${Number(deliveryCharges).toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Removal:" size="sm" bold />
						<TextComponent text={`${currencySign} ${Number(totalRemovalCharges).toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Warranty:" size="sm" bold />
						<TextComponent text={`${currencySign} ${warranty.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="5% GST:" size="sm" bold />
						<TextComponent text={`${currencySign} ${tax5.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="7% PST:" size="sm" bold />
						<TextComponent text={`${currencySign} ${tax7.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<DividerComponent my={0} variant="dashed" p={0} py={0} />
					<GroupComponent justify="space-between">
						<TextComponent text="Sub Total:" size="sm" bold />
						<TextComponent text={`${currencySign} ${subTotal.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Discount:" bold c="red" />
						<TextComponent text={`- ${currencySign} ${discount.toFixed(2)}`} bold c="red" />
					</GroupComponent>
					{isExchangeMode && (
						<GroupComponent justify="space-between">
							<TextComponent text="Original Item Value:" bold c="red" />
							<TextComponent text={`- ${currencySign} ${originalItemTotal.toFixed(2)}`} bold c="red" />
						</GroupComponent>
					)}
					<GroupComponent justify="space-between">
						<TextComponent text="Total:" bold c="green" />
						<TextComponent text={`${currencySign} ${Math.abs(Number(total.toFixed(2)))} `} bold c="green" />
					</GroupComponent>
				</StackComponent>
			</CardComponent>

			<BoxComponent h={60} className="mt-5">
				<GroupComponent grow justify="space-evenly" style={{ flexGrow: 1 }}>
					<DeliveryButton
						fullAddress={fullAddress}
						orderDate={orderDate}
						customer={customer}
						cartItems={cartItems}
						note={note}
						customerSignature={customerSignature}
					/>
					<PickupButton
						fullAddress={fullAddress}
						orderDate={orderDate}
						customer={customer}
						cartItems={cartItems}
						note={note}
						customerSignature={customerSignature}

					/>
					<InvoiceButton
						totalRemovalCharges={totalRemovalCharges}
						deliveryCharges={deliveryCharges}
						fullAddress={fullAddress}
						orderDate={orderDate}
						totalEHF={totalEHF}
						warranty={warranty}
						subTotal={subTotal}
						customer={customer}
						cartItems={cartItems}
						discount={discount}
						total={total}
						paymentType={paymentMethod}
						note={note}
						tax5={tax5}
						tax7={tax7}
						customerSignature={customerSignature}
					/>
				</GroupComponent>
			</BoxComponent>
		</ModalComponent>
	);
};

export default InvoiceDetailModal;
