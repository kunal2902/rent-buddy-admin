import React from "react";
import { ButtonComponent } from "@/components";
import { formatDate } from "@/utils";

interface CartItem {
	quantity: number;
	item: {
		name: string;
		msrp: string;
		price: string;
		short_description: string;
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

const DeliveryButton = (props: Props) => {
	const {
		orderDate,
		customer,
		fullAddress,
		cartItems,
		note,
		customerSignature,
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
	<title>Delivery Slip</title>
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
            align-items: center;
            margin-bottom: 15px;
            border: 2px solid black;
            padding: 10px;
        }

        .company-info {
      flex: 0 0 auto;
      width: 28%;
      font-size: 11px;
      line-height: 1.4;
    }
    .company-info a { color: black; text-decoration: none; }

        .logo-section {
      flex: 0 0 auto;
      width: 22%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
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
        
        .invoice-title-section {
      flex: 0 0 auto;
      width: 22%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .invoice-title-section img {
    width: 100%;
    }
    .invoice-title-section h1 {
      font-size: 36px;
      font-weight: bold;
      margin: 0 0 4px 0;
      letter-spacing: 1px;
    }
    .invoice-title-section .email {
      font-size: 10px;
    }

        .contact-info {
            flex: 1;
            text-align: right;
            font-size: 10px;
        }

        .invoice-date-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
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

        .delivery-details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 2px solid black;
        }

        .delivery-details-table td {
            border: 1px solid black;
            padding: 8px;
            font-size: 10px;
            vertical-align: middle;
        }

        .delivery-details-table .category-cell {
            background-color: #f0f0f0;
            font-weight: bold;
            width: 33%;
        }

        .delivery-details-table .service-cell {
            width: 33%;
        }

        .delivery-details-table .yesno-cell {
            width: 34%;
            text-align: center;
        }

        .removals-cell {
            text-align: center;
            font-size: 9px;
            font-weight: bold;
        }

        .acknowledgment-section {
            font-size: 9px;
            line-height: 1.2;
            margin-bottom: 15px;
            text-align: justify;
        }

        .signature-section {
            margin: 20px 0;
            text-align: center;
            font-size: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
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
      <img src="/images/nca_logo_2.png" alt="Logo" />
            <h1>INVOICE</h1>
    </div>
		<div class="invoice-title-section">
    <img src="/images/nca_product.png" alt="Sales product" />
      <div class="email">ncaisales@gmail.com</div>
    </div>
	</div>

	<div class="invoice-date-section">
		<div><strong>INVOICE DATE:</strong> ${formatDate(orderDate)}</div>
		<div><strong>DELIVERY DATE:</strong> _______________</div>
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
			<td style="text-align: left;">${item.item.short_description}</td>
			<td>${item.item.name}</td>
		</tr>
		`).join("")}
		${Array.from({ length: Math.max(0, 10 - cartItems.length) }, () => `
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

	<table class="delivery-details-table">
		<tbody>
			<tr>
				<td class="category-cell">STEPS OUTSIDE:</td>
				<td class="service-cell">HOSES BOUGHT ($25)</td>
				<td class="yesno-cell"><strong>YES / NO</strong></td>
			</tr>
			<tr>
				<td class="category-cell">STEPS INSIDE:</td>
				<td class="service-cell">DOOR REMOVAL ($35 ea.)</td>
				<td class="yesno-cell"><strong>YES / NO</strong></td>
			</tr>
			<tr>
				<td class="category-cell">ENTRY DOOR - SINGLE DOUBLE</td>
				<td class="service-cell">DRYER VENT ($25)</td>
				<td class="yesno-cell"><strong>YES / NO</strong></td>
			</tr>
			<tr>
				<td class="category-cell">GROUND LVL UPSTAIRS BASEMENT</td>
				<td class="service-cell"><strong>BALANCE OWING:</strong></td>
				<td class="yesno-cell">$ ___________</td>
			</tr>
			<tr>
				<td colspan="3" class="removals-cell">
					REMOVALS / RELOCATIONS - Fridge / Stacker $30 ea., Other items $10 ea. (MUST BE DISCONNECTED)
				</td>
			</tr>
		</tbody>
	</table>

	<div class="acknowledgment-section">
		I acknowledge that I received all the products listed above safely and without any damage to my property. I am completely satisfied with the delivery service.
	</div>

	<div class="signature-section">
		    <div>
		    Customer Signature:
            </div>
            <div>
            <img src=${customerSignature} height="100px" width="120px">
            </div>
				 
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
		<ButtonComponent title="Delivery" onClick={renderDelivery} />
	);
};

export default DeliveryButton;
