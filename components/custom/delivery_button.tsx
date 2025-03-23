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
}

const DeliveryButton = (props: Props) => {
	const {
		orderDate,
		customer,
		fullAddress,
		cartItems,
		note,
	} = props;

	const renderDelivery = () => {
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
            font-size: 12px;
            margin: 0;
            padding: 0;
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
            margin-bottom: 10px;
        }

        .header .image_container {
            margin-left: 10px;
        }

        .image_container img {
            height: 50px;
            width: 100px;
        }
        
        .item-table td {
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 150px;
		}

        .invoice-details,
        .totals-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .invoice-details th,
        .invoice-details td {
            padding: 5px;
            text-align: left;
        }

        .item-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .item-table th,
        .item-table td {
			border: 1px solid #ccc;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 150px;
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
            margin-top: 10px;
        }

        @media print {
            @page {
                size: auto;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
            }
            .container {
                border: none;
                padding: 0;
            }
            .header, .invoice-details, .item-table, .warranty, .footer {
                margin: 0;
                padding: 0;
            }

        .balance-owing {
            font-weight: bold;
            text-align: right;
        }
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
			<h1>DELIVERY SLIP</h1>
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
		</tr>
		</thead>
		<tbody>
		${cartItems.map(item => `
		<tr>
			<td>${item.quantity}</td>
			<td>${item.item.name}</td>
			<td></td>
		</tr>
		`).join("")}
		</tbody>
	</table>
	
	<div class="terms">
		<p>Additonal Note - ${note}</p>
	</div>

	<div class="terms">
		<p>Delivery - In order to facilitate the delivery of my shipment, I hereby give permission to the driver to use my driveway, walk, curb, lawn, steps, flooring etc. and hereby exempt New Country Appliances Inc. from responsibility for any damage caused either outside or inside my house by their REASONABLE and PRUDENT use of this authority. It is hereby understood and agreed that New Country Appliances Inc. does not take any responsibility for any loss or damage to my property. I agree to pay a $35 charge if the fridge doors or the house door needs to be removed for delivery.</p>
	</div>

	<table class="item-table">
		<tbody>
			<tr>
				<td>STEPS OUTSIDE:</td>
				<td>HOSES BODGHT ($25)</td>
				<td>YES / NO</td>
			</tr>
			<tr>
				<td>STEPS INSIDE:</td>
				<td>DOOR REMOVAL ($35ea.)</td>
				<td><span>YES / NO</span></td>
			</tr>
			<tr>
				<td>ENTRY DOOR - SINGLE DOUBLE</td>
				<td>DRYER VENT ($25)</td>
				<td><span>YES / NO</span></td>
			</tr>
			<tr>
				<td>GROUND LVL UPSTAIRS BASEMENT</td>
				<td>BALANCE OWING:</td>
				<td></td>
			</tr>
			<td colspan="4">
				REMOVALS / RELOCATION - Fridge / Stacker $30 ea., Other items $10 ea. (MUST BE DISCONNECTED)
			</td>
		</tbody>
	</table>

	<div class="terms">
		<p>I acknowledge that I received all the products listed above safely and without any damage to my property. 
            I am completely satisfied with the delivery service.</p>
	</div>
	
	<div class="terms">
		<p>Customer Signature: _______________________</p>
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
		<ButtonComponent title="Delivery" onClick={renderDelivery} />
	);
};

export default DeliveryButton;
