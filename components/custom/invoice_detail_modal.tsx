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

interface Props {
	tax5:number;
	tax7: number;
	total: number;
	isOpen: boolean;
	subTotal: number;
	discount: number;
	totalMsrp: number;
	orderDate: string;
	onClose: () => void;
	totalDiscount: number;
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
}

const InvoiceDetailModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		total,
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
		totalDiscount,
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

	const renderInvoice = () => {
		// Try to open a new window
		const invoiceWindow = window.open("", "_blank", "width=800,height=900");

		// Check if the window was successfully created
		if (!invoiceWindow) {
			console.log("Unable to open a new window. Please disable your popup blocker and try again.");
			return;
		}

		// Add the invoice HTML content
		invoiceWindow.document.write(`
		<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Invoice</title>
	<style>
        body {
            font-family: Arial, sans-serif;
        }

        .container {
            width: 80%;
            margin: 20px auto;
            border: 1px solid #ccc;
            padding: 20px;
        }

        .header {
			display: flex;
			justify-content: space-between;
            /*text-align: center;*/
            margin-bottom: 20px;
			border: 1px solid black;
        }

		.header .image_container {
			margin-left: 10px;
		}

        .image_container img {
			height: 50px;
			width: 100px;
        }

        .invoice-details,
        .totals-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .invoice-details th,
        .invoice-details td {
            padding: 5px;
            text-align: left;
        }

        .item-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .item-table th,
        .item-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }

        .warranty {
            padding: 10px;
            margin-bottom: 20px;
        }

        .totals-table td {
            padding: 5px;
            text-align: right;
        }

        .totals-table td:first-child {
            text-align: left;
        }

        .footer {
            text-align: center;
            font-size: 0.9em;
        }
	</style>
</head>

<body>
<div class="container">
	<div class="header">
		<div>
			<p>
				13533 78 Avenue<br>
				Surrey, BC. V3W 0A8<br>
				Phone: 604-593-6890<br>
				Fax: 604-593-1289<br>
				<a href="https://www.newcountryappliances.com/">www.newcountryappliances.com</a><br>
				ncasales@gmail.com
			</p>
		</div>
		<div class="image_container">
<!--			<img src="/images/nca_logo_2.png" alt="Company Logo" />-->
			<h1>INVOICE</h1>
		</div>
		<div class="image_container">
<!--			<img src="logo.png" alt="Company Logo">-->
			<a href="mailto:ncaisales@gmail.com"><h4>ncaisales@gmail.com</h4></a>
		</div>

	</div>

	<table class="invoice-details">
		<tr>
			<th>INVOICE DATE:</th>
			<td>
				<strong>${formatDate(orderDate)}</strong>
			</td>
			<th>DELIVERY DATE:</th>
			<td>
			</td>
		</tr>
		<tr>
			<th>SOLD TO:</th>
			<td>${customer.name}</td>
			<th>SHIP TO:</th>
			<td>${fullAddress}</td>
		</tr>
	</table>

	<table class="item-table">
		<thead>
		<tr>
			<th>QUANTITY</th>
			<th>DESCRIPTION</th>
			<th>ITEM #</th>
			<th>UNIT COST</th>
			<th>AMOUNT</th>
		</tr>
		</thead>
		<tbody>
		${cartItems.map(item => `
		<tr>
			<td>${item.quantity}</td>
			<td>${item.item.name}</td>
			<td></td>
			<td>${currencySign} ${parseInt(item.item.msrp, 10).toFixed(2)}</td>
			<td>${currencySign} ${(parseInt(item.item.price, 10) * item.quantity).toFixed(2)}</td>
		</tr>
		`).join("")}
		</tbody>

		<tr>
			<td colspan="3"></td>
			<td>EHF</td>
			<td>${currencySign} ${totalEHF?.toFixed(2)}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>DELIVERY</td>
			<td>${currencySign} ${Number(deliveryCharges).toFixed(2)}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>REMOVAL</td>
			<td>${currencySign} ${Number(totalRemovalCharges).toFixed(2)}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>5% GST</td>
			<td>${currencySign} ${tax5.toFixed(2)}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>7% PST</td>
			<td>${currencySign} ${tax7.toFixed(2)}</td>
		</tr>
			<tr>
			<td colspan="3"></td>
			<td>SUBTOTAL</td>
			<td>${currencySign} ${subTotal.toFixed(2)}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>DISCOUNT</td>
			<td>
				- ${currencySign} ${totalDiscount.toFixed(2)}
			</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>TOTAL</td>
			<td>
				<strong>${currencySign} ${total.toFixed(2)}</strong>
			</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>DEPOSIT</td>
			<td>0.00</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>BALANCE</td>
			<td>
				<strong>FALSE</strong>
			</td>
		</tr>
	</table>

	<div class="warranty">
		<strong>All Sales Are Final, No Returns or Refunds:</strong> Please see below for warranty periods. Warranty limited to mechanical parts & labour only. Original invoice must be presented for all repairs and warranty. ($25 Service charge for looking up lost invoices). Warranty work can only be done by us during the warranty period. There will be a $125 service charge if the technician finds that it’s not the product fault. No refunds under any circumstances. Appliance installations are the customer’s sole responsibility. Only qualified individuals must perform all installations. Any damage occurring during installation will not be covered. All products sold by New Country Appliances Inc. have been purchased as re-claimed goods from major manufacturers and carry no manufacturer’s warranty, therefore they are subject to warranty only as mentioned below. Ownership of goods remains with NCAI until paid in full. 2% interest per month on overdue accounts. NCAI is not liable for any consequential damage to any kind of property arising from products sold by us. Subject to jurisdiction of Law Courts in Surrey, BC.
	</div>

	<div class="terms">
		<p>Warranty: Unless specified above. Major Appliances - 1 Year In - Home (within the Lower Mainland, BC. Out of area customers must bring their appliances to the Surrey store for repairs). Extended warranty is provided by 3rd party warranty company. NCAI is not liable for any claims arising during extended warranty period. Microwaves, OTR’s, Vacuums, Air Conditioners, Home Audio & Electronics - 30 Days In-Store. All Clearance items, Line TV’s, Wall Mounts, cables, accessories - As Is, No Warranty.</p>
		<p>PAID ORDERS WILL BE STORED FOR 1 WEEK. STORAGE FEES WILL THEN BE CHARGED.</p>
		<p>Delivery- In order to facilitate the delivery of my shipment, I hereby give permission to the driver to use my driveway, walk, curb, lawn, steps, flooring etc. and hereby exempt New Country Appliances Inc. from responsibility for any damage caused either outside or inside my house by their REASONABLE and PRUDENT use of this authority. It is hereby understood and agreed that New Country Appliances Inc. does not take any responsibility for any loss or damage to my property. I agree to pay a $35 charge if the fridge doors or the house door needs to be removed for delivery.</p>
		<p>I agree with warranty & delivery terms & conditions. _______________________ (Customer)</p>
	</div>

	<div class="footer">
		THANK-YOU FOR SUPPORTING OUR BUSINESS, SEE YOU AGAIN<br>
		WESTERN CANADA'S LARGEST SCRATCH & DENT APPLIANCE & ELECTRONICS DEALER
	</div>
</div>
</body>

</html>
    `);

		invoiceWindow.onload = () => {
			invoiceWindow.print();
			invoiceWindow.close();
		};
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
					{/*<GroupComponent justify="space-between">*/}
					{/*	<TextComponent text="Warranty:" size="sm" bold />*/}
					{/*	<TextComponent text={`${currencySign} ${warranty.toFixed(2)}`} bold size="sm" />*/}
					{/*</GroupComponent>*/}
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
					<GroupComponent justify="space-between">
						<TextComponent text="Total:" bold c="green" />
						<TextComponent text={`${currencySign} ${total.toFixed(2)}`} bold c="green" />
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
						<ButtonComponent title="Print" onClick={renderInvoice} />
					</GroupComponent>
				</GroupComponent>
			</BoxComponent>
		</ModalComponent>
	);
};

export default InvoiceDetailModal;
