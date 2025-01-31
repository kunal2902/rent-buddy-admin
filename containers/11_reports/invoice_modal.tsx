"use client";

import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useRecoilValue } from "recoil";
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
	currencySign,
	formatDate,
	toTitleCase,
	cartPaymentMethodAtom,
} from "@/utils";
import { CartItemModel, CustomerModel } from "@/models";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	subTotal: number;
	total: number;
	tax5: number;
	tax7: number;
	orderDate: string;
	totalEHF?: number;
	totalRemovalCharges: number;
	fullAddress?: string;
	deliveryCharges?: string | number;
	paymentType: string,
	customer: CustomerModel;
	cartItems: CartItemModel[];
}

const InvoiceModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		total,
		tax5,
		tax7,
		subTotal,
		totalEHF = 0,
		orderDate,
		fullAddress = "N/A",
		deliveryCharges = 0,
		totalRemovalCharges,
		paymentType,
		customer,
		cartItems,
	} = props;

	const handleCloseModal = () => {
		onClose();
	};

	const truncateText = (text: string, maxLength: number): string =>
		text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

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
			<td>${currencySign} ${item.item.price}</td>
			<td>${currencySign} ${(parseInt(item.item.price, 10) * item.quantity).toFixed(2)}</td>
		</tr>
		`).join("")}
		</tbody>

		<tr>
			<td colspan="3"></td>
			<td>EHF</td>
			<td>${currencySign} ${totalEHF}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>DELIVERY</td>
			<td>${currencySign} ${deliveryCharges}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>REMOVAL</td>
			<td>${currencySign} ${totalRemovalCharges}</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>SUBTOTAL</td>
			<td>${currencySign} ${subTotal.toFixed(2)}</td>
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
		<ModalComponent opened={isOpen} onClose={handleCloseModal} title={<TitleComponent title="Invoice Detail" />}>
			<CardComponent className="mt-3" shadow="sm" radius="md" padding="sm" withBorder>
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
						<TextComponent text="Payment Method:" bold />
						<TextComponent text={paymentType} />
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
											<TextComponent
												c="gray"
												fz={12}
												text={`${currencySign} ${parseInt(item.item.price.toString(), 10)} x ${item.quantity}`}
											/>
										</StackComponent>
									</GroupComponent>
									{index !== cartItems.length - 1 &&
										<DividerComponent my={0} mt={6} variant="dashed" p={0} py={0} />}
								</StackComponent>
							</BoxComponent>
						))}
				</ScrollAreaComponent>
			</CardComponent>

			<CardComponent padding="sm" shadow="sm" radius="md" withBorder style={{ height: "auto" }}>
				<StackComponent gap="sm">
					<GroupComponent justify="space-between">
						<TextComponent text="Total:" bold />
						<TextComponent text={`${currencySign} ${total.toFixed(2)}`} bold />
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

export default InvoiceModal;
