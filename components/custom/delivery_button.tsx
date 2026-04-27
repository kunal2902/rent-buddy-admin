import React from "react";
import { ButtonComponent } from "@/components";
import { currencySign, formatDate } from "@/utils";

interface CartItem {
	quantity: number;
	item: {
		name: string;
		msrp: string;
		price: string;
		short_description?: string;
		item_id?: string;
	};
}

interface Props {
	customer: {
		name: string;
		id: string;
	};
	cartItems: CartItem[];
	orderDate: string;
	fullAddress:string | undefined;
	note: string | undefined;
	customerSignature: string | undefined;
invoiceId: string;
}

const DeliveryButton = (props: Props) => {
	const {
		orderDate,
		customer,
		fullAddress,
		cartItems,
		note,
		customerSignature,
		invoiceId,
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; font-size: 11px; padding: 12px; color: #000; line-height: 1.2; }
.container { width: 100%; max-width: 840px; margin: 0 auto; }
.header { display: flex; align-items: stretch; margin-bottom: 6px; }
.header-logo { flex: 0 0 30%; padding: 8px 10px; display: flex; flex-direction: column; justify-content: center; }
.header-logo img { width: 110px; max-height: 80px; object-fit: contain; }
.header-logo .logo-placeholder { width: 110px; height: 70px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; font-size: 10px; color: #666; }
.header-logo .company-name { font-size: 10px; margin-top: 6px; line-height: 1.35; }
.header-logo .company-name strong { font-size: 11px; }
.header-logo .company-name a { color: #000; text-decoration: none; }
.header-invoice { flex: 0 0 30%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; }
.header-invoice h1 { font-size: 36px; font-weight: 900; letter-spacing: 2px; margin-top: 4px; }
.header-details { flex: 0 0 40%; display: flex; flex-direction: column; }
.header-details-grid { flex: 1; }
.header-details-grid table { width: 100%; height: 100%; border-collapse: collapse; }
.header-details-grid td { border: 1px solid #000; padding: 5px 7px; font-size: 11px; vertical-align: middle; }
.header-details-grid td:first-child { font-weight: bold; background: #f0f0f0; white-space: nowrap; width: 45%; }
.gst-bar { border-top: 1px solid #000; padding: 5px 8px; font-size: 11px; font-weight: bold; text-align: right; }
.website-line { font-size: 10px; margin-bottom: 5px; margin-top: 2px; }
.website-line a { color: #000; text-decoration: none; }
.address-row { display: flex; gap: 8px; margin-bottom: 5px; }
.address-box { flex: 1; border: 1px solid #000; padding: 6px 8px; min-height: 64px; font-size: 11px; line-height: 1.45; }
.address-box strong { display: block; margin-bottom: 3px; }
.items-table { width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 15px; }
.items-table th { background: #f0f0f0; border: 1px solid #000; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 10px; }
.items-table td { border: 1px solid #000; padding: 5px 4px; text-align: center; font-size: 10px; vertical-align: top; height: 25px; }
.items-table td.left { text-align: left; padding-left: 6px; }

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

  <!-- HEADER -->
  <div class="header">
    <div class="header-logo">
      <img src="/images/nca_logo_2.png" alt="NCA Logo"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
      <div class="logo-placeholder" style="display:none;">NCA LOGO</div>
      <div class="company-name">
        <strong>New Country Appliances Inc.</strong><br>
        13533 78 Avenue, Surrey, BC. V3W 0A8<br>
        Phone: 604-593-6890 &nbsp; Fax: 604-593-1289<br>
        <a href="https://www.newcountryappliances.com">www.newcountryappliances.com</a>
      </div>
    </div>
    <div class="header-invoice">
      <h1>DELIVERY SLIP</h1>
    </div>
    <div class="header-details">
      <div class="header-details-grid">
        <table>
  <tr><td>Invoice #</td><td>${invoiceId || "&nbsp;"}</td></tr>
  <tr><td>Date</td><td>${formatDate(orderDate)}</td></tr>
  <tr><td>Sales Person</td><td>${"&nbsp;"}</td></tr>
</table>
      </div>
      <div class="gst-bar">GST# 885439468RT0001</div>
    </div>
  </div>

  <!-- WEBSITE -->
  <div class="website-line">
    Visit our website at
    <a href="https://www.newcountryappliances.com">WWW.NEWCOUNTRYAPPLIANCES.COM</a>
  </div>

  <!-- BILL TO / SHIP TO -->
  <div class="address-row">
    <div class="address-box">
      <strong>Bill To:</strong>
      ${customer?.name || "&nbsp;"} <br/>
      ${fullAddress}
    </div>
    <div class="address-box">
      <strong>Ship To:</strong> <br/>
      ${customer.id}
      ${fullAddress || "&nbsp;"}
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
  <th style="width:6%;">S No.</th>
  <th style="width:67%;">DESCRIPTION</th>
  <th style="width:13%;">PRICE</th>
</tr>
    </thead>
    <tbody>
     ${cartItems.map((item, idx) => `
<tr>
  <td>${idx + 1}</td>
  <td class="left">
    <strong>${item?.item?.item_id ?? idx + 1}</strong> &nbsp;
    ${item.item.name}
    ${item.item.short_description ? `<span style="color:#444;">${item.item.short_description}</span>` : ""}
  </td>
  <td>${currencySign}${(Number(item.item.price) * item.quantity).toFixed(2)}</td>
</tr>
`).join("")}
${Array.from({ length: Math.max(0, 12 - cartItems.length) }, () => `
<tr>
  <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
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
