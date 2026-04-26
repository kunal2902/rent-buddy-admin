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
		item_id: string;
		nc_number?:string
	};
}

interface Props {
	customer: {
		name: string;
		id: string;
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
	invoiceId: string;
	nc_number?: string;
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
		invoiceId,
		nc_number,
	} = props;

	const renderInvoice = () => {
		const invoiceWindow = window.open("", "_blank", "width=800,height=900");

		if (!invoiceWindow) {
			console.log("Unable to open a new window. Please disable your popup blocker and try again.");
			return;
		}
		console.log("these are the cart items", cartItems);

		invoiceWindow.document.write(`
		<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Invoice</title>
	<style>
	* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; font-size: 11px; padding: 12px; color: #000; }
.container { width: 100%; max-width: 840px; margin: 0 auto; }
.header { display: flex; align-items: stretch; border: 2px solid #000; margin-bottom: 6px; }
.header-logo { flex: 0 0 30%; padding: 8px 10px; border-right: 1px solid #000; display: flex; flex-direction: column; justify-content: center; }
.header-logo img { width: 110px; max-height: 80px; object-fit: contain; }
.header-logo .logo-placeholder { width: 110px; height: 70px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; background: #f5f5f5; font-size: 10px; color: #666; }
.header-logo .company-name { font-size: 10px; margin-top: 6px; line-height: 1.35; }
.header-logo .company-name strong { font-size: 11px; }
.header-logo .company-name a { color: #000; text-decoration: none; }
.header-invoice { flex: 0 0 30%; display: flex; flex-direction: column; align-items: center; justify-content: center; border-right: 1px solid #000; padding: 8px; }
.header-invoice img { width: 100%; max-height: 85px; object-fit: contain; }
.header-invoice h1 { font-size: 40px; font-weight: 900; letter-spacing: 2px; margin-top: 4px; }
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
.items-table { width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 0; }
.items-table th { background: #f0f0f0; border: 1px solid #000; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 10px; }
.items-table td { border: 1px solid #000; padding: 5px 4px; text-align: center; font-size: 10px; vertical-align: top; }
.items-table td.left { text-align: left; padding-left: 6px; }
.notes-col { font-size: 8px; line-height: 1.3; }
.notes-col ul { padding-left: 0; list-style: none; }
.notes-col ul li { margin-bottom: 3px; }
.notes-col ul li::before { content: "* "; font-weight: bold; }
.payment-table { width: 100%; border: 2px solid #000; border-collapse: collapse; margin-top: 8px; }
.payment-table td { border: 1px solid #000; padding: 4px 7px; font-size: 11px; }
.payment-table .lbl { font-weight: bold; background: #f0f0f0; width: 55%; }
.totals-table-h { width: 100%; border: 2px solid #000; border-collapse: collapse; margin-top: 8px; }
.totals-table-h th { background: #f0f0f0; border: 1px solid #000; padding: 5px 4px; text-align: center; font-weight: bold; font-size: 9px; white-space: nowrap; }
.totals-table-h td { border: 1px solid #000; padding: 5px 4px; text-align: center; font-size: 10px; }
.footer { font-size: 10px; font-weight: bold; border-top: 1px solid #000; padding-top: 6px; margin-top: 8px; }
@media print { body { padding: 4px; } .container { max-width: 100%; } }
</style>

</head>

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
      <h1>INVOICE</h1>
    </div>
    <div class="header-details">
      <div class="header-details-grid">
        <table>
          <tr><td>Invoice #</td><td>${invoiceId}</td></tr>
          <tr><td>Date</td><td>${formatDate(orderDate)}</td></tr>
          <tr><td>Sales Person</td><td>&nbsp;</td></tr>
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
      ${customer?.name || "&nbsp;"}
    </div>
    <div class="address-box">
      <strong>Ship To:</strong>
      ${customer?.id}
      ${fullAddress || "&nbsp;"}
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width:6%;">NC #</th>
        <th style="width:54%;">MODEL / ITEM # + DESCRIPTION</th>
        <th style="width:14%;">UNIT COST</th>
        <th style="width:13%;">DISCOUNT</th>
        <th style="width:13%;">PRICE</th>
      </tr>
    </thead>
    <tbody>
      ${cartItems.map((item, idx) => `
      <tr>
        <td>${nc_number}</td>
        <td class="left">
          <strong>${item?.item?.item_id ?? idx + 1}</strong> &nbsp;
          ${item.item.name}
          ${item.item.short_description ? `<span style="color:#444;">${item.item.short_description}</span>` : ""}
        </td>
        <td>${currencySign}${Number(item.item.msrp).toFixed(2)}</td>
        <td>${currencySign}${(Number(item.item.msrp) - Number(item.item.price)).toFixed(2)}</td>
        <td>${currencySign}${(Number(item.item.price) * item.quantity).toFixed(2)}</td>
      </tr>
      `).join("")}
      ${Array.from({ length: Math.max(0, 8 - cartItems.length) }, () => `
      <tr>
        <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
      `).join("")}
    </tbody>
  </table>

  <!-- NOTES -->
  <div class="notes-col" style="margin-top:8px;">
    <ul>
      <li>Special Orders are not eligible for return and require a 50% nonrefundable &amp; nontransferable deposit.</li>
      <li>All authorized returned products will be subject to a 30% restocking charge.</li>
      <li>Invoice pricing is subject to change after 90 days.</li>
      <li>Please inspect product condition immediately. New Country Appliances must be notified of any physical defects or shipping damage within 24 hours of receipt.</li>
      <li>Appliances being hauled away must be disconnected and uninstalled prior to delivery.</li>
      <li>Appliances are warrantied as per warranty terms below. NCAI is not liable for any claims arising during extended warranty period.</li>
      <li>We offer no other implied warranty, return or exchange policy.</li>
      <li>New Country Appliances Inc. is not responsible for securing pickup items in the Customer's vehicle of choice.</li>
      <li>Ownership of goods remains with NCAI until paid in full. 2% interest per month on overdue accounts.</li>
    </ul>
    <table class="payment-table">
      <tr>
        <td class="lbl">METHOD OF PAYMENT</td>
        <td>${paymentType || "&nbsp;"}</td>
      </tr>
    </table>
  </div>

  <!-- HORIZONTAL TOTALS -->
  <table class="totals-table-h">
    <thead>
      <tr>
        <th>EHF</th>
        <th>DELIVERY</th>
        <th>REMOVAL</th>
        <th>SUB TOTAL</th>
        ${discount ? "<th>DISCOUNT</th>" : ""}
        <th>5% GST</th>
        <th>7% PST (BC)</th>
        ${warranty ? "<th>WARRANTY</th>" : ""}
        ${isExchangeMode ? "<th>ORIG. VALUE</th>" : ""}
        <th><strong>TOTAL</strong></th>
        <th>PAYMENT</th>
        <th><strong>BALANCE</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${currencySign}${Number(totalEHF ?? 0).toFixed(2)}</td>
        <td>${currencySign}${Number(deliveryCharges ?? 0).toFixed(2)}</td>
        <td>${currencySign}${Number(totalRemovalCharges ?? 0).toFixed(2)}</td>
        <td>${currencySign}${Number(subTotal).toFixed(2)}</td>
        ${discount ? `<td>&minus;${currencySign}${Number(discount).toFixed(2)}</td>` : ""}
        <td>${currencySign}${Number(tax5).toFixed(2)}</td>
        <td>${currencySign}${Number(tax7).toFixed(2)}</td>
        ${warranty ? `<td>${currencySign}${Number(warranty).toFixed(2)}</td>` : ""}
        ${isExchangeMode ? `<td>&minus;${currencySign}${Number(originalItemTotal).toFixed(2)}</td>` : ""}
        <td><strong>${currencySign}${Math.abs(Number(total)).toFixed(2)}</strong></td>
        <td>${currencySign}${Math.abs(Number(total)).toFixed(2)}</td>
        <td><strong>${currencySign}0.00</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- FOOTER -->
  <div class="footer" style="display:flex; justify-content:space-between; align-items:center;">
    <div style="font-size:13px; font-weight:900; letter-spacing:0.5px;">
      NOW 19 LOCATIONS TO SERVE YOU
    </div>
    <div style="display:flex; align-items:center; gap:6px; font-size:9px; text-align:center;">
      <div>Canadian<br>Home Builders'<br>Association</div>
      <img src="/images/chba_logo.png" alt="Canadian Home Builders' Association"
           style="height:48px; width:48px; object-fit:contain;"
           onerror="this.style.display='none';" />
    </div>
  </div>

</div>
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
