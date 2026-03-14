import React from "react";
import { ButtonComponent } from "@/components";
import { currencySign, formatDate } from "@/utils";

interface CartItem {
	quantity: number;
	item: {
		name: string;
		msrp: string;
		price: string;
	};
}

interface Props {
	customer: {
		name: string;
	};
	tax5: number;
	tax7: number;
	total: number;
	discount:number;
	cartItems: CartItem[];
	warranty: number;
	subTotal: number;
	orderDate: string;
	totalEHF: number | undefined;
	fullAddress:string | undefined;
	totalRemovalCharges: number | undefined;
	deliveryCharges: string | number | undefined;
	note: string | undefined;
	customerSignature: string | undefined;
	paymentType: string | undefined;
	isExchangeMode:boolean;
	originalItemTotal: number;
}

const InvoiceButton = (props: Props) => {
	const {
		total,
		tax5,
		tax7,
		discount,
		subTotal,
		totalEHF,
		orderDate,
		customer,
		fullAddress,
		deliveryCharges,
		totalRemovalCharges,
		cartItems,
		note,
		warranty,
		customerSignature,
		paymentType,
		isExchangeMode,
		originalItemTotal,
	} = props;

	const renderInvoice = () => {
		const invoiceWindow = window.open("", "_blank", "width=800,height=900");

		if (!invoiceWindow) {
			console.log("Unable to open a new window. Please disable your popup blocker and try again.");
			return;
		}

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
            margin: 0;
            padding: 10px;
            font-size: 12px;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            border: 2px solid black;
            padding: 10px;
        }

        .company-info {
            flex: 1;
            font-size: 11px;
            line-height: 1.3;
        }

        .company-info a {
            color: black;
            text-decoration: none;
        }

        .logo-section {
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .logo-placeholder {
            width: 80px;
            height: 80px;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            background-color: #f0f0f0;
        }

        .contact-info {
            flex: 1;
            text-align: right;
            font-size: 11px;
        }

        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .invoice-left, .invoice-right {
            flex: 1;
        }

        .invoice-right {
            text-align: right;
        }

        .detail-row {
            display: flex;
            margin-bottom: 5px;
        }

        .detail-label {
            font-weight: bold;
            min-width: 120px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border: 2px solid black;
        }

        .items-table th {
            background-color: #f0f0f0;
            border: 1px solid black;
            padding: 8px 4px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
        }

        .items-table td {
            border: 1px solid black;
            padding: 6px 4px;
            text-align: center;
            font-size: 11px;
        }

        .items-table td:nth-child(2) {
            text-align: left;
        }

        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
        }

        .totals-table {
            border: 2px solid black;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .totals-table td {
            border: 1px solid black;
            padding: 4px 8px;
            font-size: 11px;
        }

        .totals-table .label-col {
            text-align: left;
            font-weight: bold;
            background-color: #f0f0f0;
            min-width: 80px;
        }

        .totals-table .amount-col {
            text-align: right;
            min-width: 80px;
        }

        .warranty-section {
            margin: 20px 0;
            font-size: 9px;
            line-height: 1.2;
        }

        .warranty-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .terms-section {
            font-size: 9px;
            line-height: 1.2;
            margin-bottom: 20px;
        }

        .signature-line {
            margin: 10px 0;
            font-size: 10px;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            margin-top: 20px;
        }

        .gst-number {
            text-align: center;
            font-size: 10px;
            /*margin: 10px 0;*/
            font-weight: bold;
        }
      .signature-line .signature {
            display: flex;
            justify-content: center;
            align-items: center;
      }
	</style>
</head>

<body>
<div class="container">
	<div class="header">
		<div class="company-info">
			<strong>New Country Appliances Inc.</strong><br>
			13533 78 Avenue<br>
			Surrey, BC. V3W 0A8<br>
			Phone: 604-593-6890<br>
			Fax: 604-593-1289<br>
			<a href="https://www.newcountryappliances.com">www.newcountryappliances.com</a>
		</div>
<!--		<div class="logo-section">-->
<!--			<div class="logo-placeholder">-->
<!--				LOGO-->
<!--			</div>-->
<!--		</div>-->
		<div class="contact-info">
			<strong>DELIVERY DATE:</strong><br><br>
			<strong>SHIP TO:</strong><br>
			${fullAddress}
		</div>
	</div>

	<div class="invoice-details">
		<div class="invoice-left">
			<div class="detail-row">
				<span class="detail-label">INVOICE DATE:</span>
				<span>${formatDate(orderDate)}</span>
			</div>
		</div>
		<div class="invoice-right">
		</div>
	</div>

	<table class="items-table">
		<thead>
		<tr>
			<th style="width: 10%;">QUANTITY</th>
			<th style="width: 50%;">ITEM</th>
			<th style="width: 20%;">UNIT COST</th>
			<th style="width: 20%;">AMOUNT</th>
		</tr>
		</thead>
		<tbody>
		${cartItems.map(item => `
		<tr>
			<td>${item.quantity}</td>
			<td style="text-align: left;">${item.item.name}</td>
			<td>${currencySign}${item.item.price}</td>
			<td>${currencySign}${(parseInt(item.item.price, 10) * item.quantity).toFixed(2)}</td>
		</tr>
		`).join("")}
		${Array.from({ length: Math.max(0, 8 - cartItems.length) }, () => `
		<tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		`).join("")}
		</tbody>
	</table>
	
	<div style="display: flex">
	<div class="warranty-section">
		<div class="warranty-title">All Sales are Final, No Returns or Refunds.</div>
		Please see below for warranty periods. Warranty limited to mechanical parts & labour only. Original invoice must be presented for all repairs and warranty. ($25 Service charge for looking up lost invoices). Warranty work can only be done by us during the warranty period. There will be a $125 service charge if the technician finds that it's not the product fault. No refunds under any circumstances. Appliance installations are the customer's sole responsibility. Only qualified individuals must perform all installations. Any damage occurring during installation will not be covered. All products sold by New Country Appliances Inc. have been purchased as re-claimed goods from major manufacturers and carry no manufacturer's warranty, therefore they are subject to warranty only as mentioned below. Ownership of goods remains with NCAI until paid in full. 2% interest per month on overdue accounts. NCAI is not liable for any consequential damage to any kind of property arising from products sold by us. Subject to jurisdiction of Law Courts in Surrey, BC.
		<div>
        <table class="totals-table" style="width: 100%">
        <tr>
        <td class="label-col">Method Of Payment</td>
        <td class="amount-col">${paymentType}</td>
</tr>
</table>
</div>
	</div>
		<div class="totals-section">
		<table class="totals-table">
			<tr>
				<td class="label-col">EHF</td>
				<td class="amount-col">${currencySign}${totalEHF?.toFixed(2)}</td>
			</tr>
			<tr>
				<td class="label-col">DELIVERY</td>
				<td class="amount-col">${currencySign}${deliveryCharges}</td>
			</tr>
			<tr>
				<td class="label-col">REMOVAL</td>
				<td class="amount-col">${currencySign}${totalRemovalCharges?.toFixed(2)}</td>
			</tr>
			<tr>
				<td class="label-col">PRICE</td>
				<td class="amount-col">${currencySign}${cartItems[0].item.price}</td>
			</tr>
			<tr>
				<td class="label-col">5% GST</td>
				<td class="amount-col">${currencySign}${tax5.toFixed(2)}</td>
			</tr>
			<tr>
				<td class="label-col">7% PST</td>
				<td class="amount-col">${currencySign}${tax7.toFixed(2)}</td>
			</tr>
			${isExchangeMode ?
			`<tr>
				<td class="label-col">Original Item Value</td>
				<td class="amount-col">${currencySign}${originalItemTotal}</td>
			</tr>` : ""
			}
			<tr>
				<td class="label-col"><strong>TOTAL</strong></td>
				<td class="amount-col"><strong>${currencySign}${Math.abs(Number(total.toFixed(2)))}</strong></td>
			</tr>
			<tr>
				<td class="label-col">DEPOSIT</td>
				<td class="amount-col">${currencySign}${Math.abs(Number(total.toFixed(2)))}</td>
			</tr>
			<tr>
				<td class="label-col"><strong>BALANCE</strong></td>
				<td class="amount-col"><strong>False</strong></td>
			</tr>
		</table>
	</div>

</div>


	<div class="gst-number">
		<strong>GST # 885439468RT0001</strong>
	</div>

	

	<div class="terms-section">
		<p><strong>Warranty:</strong> Unless specified above. Major Appliances - 1 Year In - Home (within the Lower Mainland, BC. Out of area customers must bring their appliances to the Surrey store for repairs). Extended warranty is provided by 3rd party warranty company. NCAI is not liable for any claims arising during extended warranty period. Microwaves, OTR's, Vacuums, Air Conditioners, Home Audio & Electronics - 30 Days In-Store. All Clearance items, Line TV's, Wall Mounts, cables, accessories - As Is, No Warranty.</p>
		
		<p><strong>PAID ORDERS WILL BE STORED FOR 1 WEEK. STORAGE FEES WILL THEN BE CHARGED.</strong></p>
		
		<p><strong>Delivery-</strong> In order to facilitate the delivery of my shipment, I hereby give permission to the driver to use my driveway, walk, curb, lawn, steps, flooring etc, and hereby exempt New Country Appliances Inc. from responsibility for any damage caused either outside or inside my house by their REASONABLE and PRUDENT use of this authority. It is hereby understood and agreed that New Country Appliances Inc. does not take any responsibility for any loss or damage to my property. I agree to pay a $35 charge if the fridge doors or the house door needs to be removed for delivery.</p>
		
		<div class="signature-line">
		<div class="signature">
		<p>
		I agree with warranty & delivery terms & conditions.
</p>
<img src=${customerSignature} height="50px" width="60px" />
</div>
			
		</div>
	</div>

	<div class="footer">
		<strong>THANK-YOU FOR SUPPORTING OUR BUSINESS, SEE YOU AGAIN</strong><br>
		<strong>WESTERN CANADA'S LARGEST SCRATCH & DENT APPLIANCE & ELECTRONICS DEALER</strong>
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
		<ButtonComponent title="Print" onClick={renderInvoice} />
		);
};

export default InvoiceButton;
