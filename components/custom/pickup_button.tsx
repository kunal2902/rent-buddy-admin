import React from "react";
import { ButtonComponent } from "@/components";
import { formatDate } from "@/utils";

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
	cartItems: CartItem[];
	orderDate: string;
	fullAddress:string | undefined;
	note: string | undefined;
	customerSignature: string | undefined;
}

const PickupButton = (props: Props) => {
	const {
		orderDate,
		customer,
		fullAddress,
		cartItems,
		note,
		customerSignature,
	} = props;

	const renderPickup = () => {
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
	<title>Pickup Slip</title>
	<style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 10px;
            line-height: 1.2;
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
            margin-bottom: 15px;
            border: 2px solid black;
            padding: 10px;
        }

        .company-info {
            flex: 1;
            font-size: 10px;
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
            font-size: 10px;
        }

        .contact-info {
            flex: 1;
            text-align: right;
            font-size: 10px;
        }

        .customer-info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 2px solid black;
        }

        .customer-info-table td {
            border: 1px solid black;
            padding: 8px;
            font-size: 10px;
            vertical-align: top;
        }

        .customer-info-table .label-cell {
            background-color: #f0f0f0;
            font-weight: bold;
            width: 15%;
            text-align: center;
        }

        .customer-info-table .data-cell {
            width: 35%;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 2px solid black;
        }

        .items-table th {
            background-color: #f0f0f0;
            border: 1px solid black;
            padding: 8px 4px;
            text-align: center;
            font-weight: bold;
            font-size: 10px;
        }

        .items-table td {
            border: 1px solid black;
            padding: 6px 4px;
            text-align: center;
            font-size: 10px;
            height: 25px;
        }

        .items-table td:nth-child(2) {
            text-align: left;
        }

        .terms-section {
            font-size: 9px;
            line-height: 1.2;
            margin-bottom: 15px;
            text-align: justify;
        }

        .acknowledgment-section {
            font-size: 9px;
            line-height: 1.2;
            margin-bottom: 15px;
            text-align: justify;
            font-style: italic;
        }

        .signature-section {
            margin: 20px 0;
            text-align: center;
        }

        .signature-line {
            font-size: 10px;
            margin-bottom: 15px;
        }

        .signature-row {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }

        .signature-item {
            font-size: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            margin-top: 20px;
        }

        .footer-subtitle {
            text-align: center;
            font-size: 9px;
            font-style: italic;
            margin-top: 5px;
        }

        @media print {
            @page {
                size: auto;
                margin: 0.5in;
            }
            body {
                margin: 0;
                padding: 0;
            }
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
			<a href="https://www.newcountryappliances.com">www.newcountryappliances.com</a><br>
			ncasales@gmail.com
		</div>
		<div class="logo-section">
			<div class="logo-placeholder">
				LOGO
			</div>
		</div>
		<div class="contact-info">
			<a href="mailto:ncaisales@gmail.com"><strong>ncaisales@gmail.com</strong></a>
		</div>
	</div>

	<table class="customer-info-table">
		<tr>
			<td class="label-cell">SOLD TO:</td>
			<td class="data-cell">${customer.name}</td>
			<td class="label-cell">SHIP TO:</td>
			<td class="data-cell">${fullAddress}</td>
		</tr>
	</table>

	<table class="items-table">
		<thead>
		<tr>
			<th style="width: 15%;">QUANTITY</th>
			<th style="width: 65%;">DESCRIPTION</th>
			<th style="width: 20%;">ITEM #</th>
		</tr>
		</thead>
		<tbody>
		${cartItems.map(item => `
		<tr>
			<td>${item.quantity}</td>
			<td style="text-align: left;">${note}</td>
			<td>${item.item.name}</td>
		</tr>
		`).join("")}
		${Array.from({ length: Math.max(0, 12 - cartItems.length) }, () => `
		<tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		`).join("")}
		</tbody>
	</table>

	<div class="terms-section">
		<strong>Delivery -</strong> In order to facilitate the delivery of my shipment, I hereby give permission to the driver to use my driveway, walk, curb, lawn, steps, flooring etc. and hereby exempt New Country Appliances Inc. from responsibility for any damage caused either outside or inside my house by their REASONABLE and PRUDENT use of this authority. It is hereby understood and agreed that New Country Appliances Inc. does not take any responsibility for any loss or damage to my property. I agree to pay a $35 charge if the fridge doors or the house door needs to be removed for delivery.
	</div>

	<div class="acknowledgment-section">
		I acknowledge that I received all the products listed above safely and without any damage to my property. It is hereby understood and agreed that <strong>New Country Appliances Inc.</strong> doesn't take any responsibility for any loss or damage to my property. I am completely satisfied with the delivery service.
	</div>

	<div class="signature-section">
		<div class="signature-line">
			<strong>I agree with the terms & conditions</strong>
		</div>
		
		<div class="signature-row">
			<div class="signature-item">
				Driver Signature: _________________________
			</div>
			<div class="signature-item">
		    <div>
		    Customer Signature:
            </div>
            <div>
            <img src=${customerSignature} height="100px" width="120px">
            </div>
				 
			</div>
		</div>
	</div>

	<div class="footer">
		<strong>THANK-YOU FOR SUPPORTING OUR BUSINESS, SEE YOU AGAIN</strong>
	</div>
	
	<div class="footer-subtitle">
		<strong>WESTERN CANADA'S LARGEST SCRATCH & DENT APPLIANCE & ELECTRONICS DEALER</strong>
	</div>

	${note ? `<div style="margin-top: 15px; font-size: 10px;"><strong>Additional Note:</strong> ${note}</div>` : ""}
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
		<ButtonComponent title="Pickup" onClick={renderPickup} />
	);
};

export default PickupButton;
