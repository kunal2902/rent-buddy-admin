// InvoiceModal.tsx — full updated file

"use client";

import React from "react";
import {
	BoxComponent, ButtonComponent,
	CardComponent,
	DividerComponent,
	GroupComponent, ModalComponent, ScrollAreaComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
} from "@/components";
import {
	appAccentColorRGBA,
	currencySign,
	formatDate,

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
	totalRemovalCharges?: number;
	fullAddress?: string;
	deliveryCharges?: string | number;
	paymentType?: string;
	customer: CustomerModel;
	cartItems: CartItemModel[];
	warranty?: number;
	discount?: number;
	invoiceNumber?: string;
	salesperson?: string;
	billAddress?: string;
	shipVia?: string;
	pickupDate?: string;
	note?: string;
	customerSignature?: string;
	isExchangeMode?: boolean;
	originalItemTotal?: number;
	invoiceId?: string;
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
		totalRemovalCharges = 0,
		paymentType = "",
		customer,
		cartItems,
		warranty = 0,
		discount = 0,
		billAddress = "",
		isExchangeMode = false,
		originalItemTotal = 0,
		invoiceId,
	} = props;

	const handleCloseModal = () => onClose();

	const truncateText = (text: string, maxLength: number): string =>
		text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

	const balance = 0; // Balance = Total - Payment (assumed fully paid)
	const EMPTY_ROWS = Math.max(0, 8 - cartItems.length);

	const renderInvoice = () => {
		const invoiceWindow = window.open("", "_blank", "width=870,height=1100");
		if (!invoiceWindow) {
			console.log("Unable to open a new window. Please disable your popup blocker and try again.");
			return;
		}

		invoiceWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      padding: 12px;
      color: #000;
    }
    .container {
      width: 100%;
      max-width: 840px;
      margin: 0 auto;
    }
 
    /* ── HEADER ─────────────────────────────────────── */
    .header {
      display: flex;
      align-items: stretch;
      margin-bottom: 6px;
    }
    .header-logo {
      flex: 0 0 30%;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .header-logo img { width: 110px; max-height: 80px; object-fit: contain; }
    .header-logo .logo-placeholder {
      width: 110px; height: 70px;
      display: flex; align-items: center; justify-content: center;
      background: #f5f5f5; font-size: 10px; color: #666;
    }
    .header-logo .company-name {
      font-size: 10px; margin-top: 6px; line-height: 1.35;
    }
    .header-logo .company-name strong { font-size: 11px; }
    .header-logo .company-name a { color: #000; text-decoration: none; }
 
    .header-invoice {
      flex: 0 0 30%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
    .header-invoice img { width: 100%; max-height: 85px; object-fit: contain; }
    .header-invoice h1 {
      font-size: 40px;
      font-weight: 900;
      letter-spacing: 2px;
      margin-top: 4px;
    }
 
    .header-details {
      flex: 0 0 40%;
      display: flex;
      flex-direction: column;
    }
    .header-details-grid {
      flex: 1;
    }
    .header-details-grid table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
    }
    .header-details-grid td {
      border: 1px solid #000;
      padding: 5px 7px;
      font-size: 11px;
      vertical-align: middle;
    }
    .header-details-grid td:first-child {
      font-weight: bold;
      background: #f0f0f0;
      white-space: nowrap;
      width: 45%;
    }
    .gst-bar {
      border-top: 1px solid #000;
      padding: 5px 8px;
      font-size: 11px;
      font-weight: bold;
      text-align: right;
    }
 
    /* ── WEBSITE LINE ────────────────────────────────── */
    .website-line {
      font-size: 10px;
      margin-bottom: 5px;
      margin-top: 2px;
    }
    .website-line a { color: #000; text-decoration: none; }
 
    /* ── BILL TO / SHIP TO ───────────────────────────── */
    .address-row {
      display: flex;
      gap: 8px;
      margin-bottom: 5px;
    }
    .address-box {
      flex: 1;
      border: 1px solid #000;
      padding: 6px 8px;
      min-height: 64px;
      font-size: 11px;
      line-height: 1.45;
    }
    .address-box strong { display: block; margin-bottom: 3px; }
 
    /* ── INFO ROW TABLE ──────────────────────────────── */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 5px;
      border: 1px solid #000;
    }
    .info-table th, .info-table td {
      border: 1px solid #000;
      padding: 4px 6px;
      text-align: center;
      font-size: 10px;
    }
    .info-table th { background: #f0f0f0; font-weight: bold; }
 
    /* ── ITEMS TABLE ─────────────────────────────────── */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #000;
      margin-bottom: 0;
    }
    .items-table th {
      background: #f0f0f0;
      border: 1px solid #000;
      padding: 6px 4px;
      text-align: center;
      font-weight: bold;
      font-size: 10px;
    }
    .items-table td {
      border: 1px solid #000;
      padding: 5px 4px;
      text-align: center;
      font-size: 10px;
      vertical-align: top;
    }
    .items-table td.left { text-align: left; padding-left: 6px; }
 
    /* ── BOTTOM SECTION ──────────────────────────────── */
    .bottom-section {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 8px;
    }
    .notes-col {
      flex: 1 1 56%;
      font-size: 8px;
      line-height: 1.3;
    }
    .notes-col ul {
      padding-left: 0;
      list-style: none;
    }
    .notes-col ul li {
      margin-bottom: 3px;
    }
    .notes-col ul li::before {
      content: "* ";
      font-weight: bold;
    }
    .payment-table {
      width: 100%;
      border: 2px solid #000;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .payment-table td {
      border: 1px solid #000;
      padding: 4px 7px;
      font-size: 11px;
    }
    .payment-table .lbl {
      font-weight: bold;
      background: #f0f0f0;
      width: 55%;
    }
 
    .totals-col {
      flex: 0 0 42%;
    }
    .totals-table {
      width: 100%;
      border: 2px solid #000;
      border-collapse: collapse;
    }
    .totals-table td {
      border: 1px solid #000;
      padding: 4px 8px;
      font-size: 11px;
    }
    .totals-table .lbl {
      text-align: left;
      font-weight: bold;
      background: #f0f0f0;
      width: 55%;
    }
    .totals-table .amt {
      text-align: right;
    }
    
.totals-table-h {
  width: 100%;
  border: 2px solid #000;
  border-collapse: collapse;
  margin-top: 8px;
}
.totals-table-h th {
  background: #f0f0f0;
  border: 1px solid #000;
  padding: 5px 4px;
  text-align: center;
  font-weight: bold;
  font-size: 9px;
  white-space: nowrap;
}
.totals-table-h td {
  border: 1px solid #000;
  padding: 5px 4px;
  text-align: center;
  font-size: 10px;
}
 
    /* ── GST / TERMS / SIGNATURE / FOOTER ───────────── */
    .gst-center {
      text-align: center;
      font-size: 10px;
      font-weight: bold;
      margin: 7px 0 4px;
    }
    .terms-section {
      font-size: 8px;
      line-height: 1.3;
      margin-bottom: 8px;
    }
    .terms-section p { margin-bottom: 3px; }
    .signature-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 10px;
      margin: 8px 0 4px;
      border-top: 1px solid #ccc;
      padding-top: 6px;
    }
    .signature-row img { height: 40px; width: 60px; object-fit: contain; }
    .footer {
      text-align: center;
      font-size: 10px;
      font-weight: bold;
      border-top: 1px solid #000;
      padding-top: 6px;
      margin-top: 8px;
    }
 
    @media print {
      body { padding: 4px; }
      .container { max-width: 100%; }
    }
  </style>
</head>
<body>
<div class="container">
 
  <!-- ── HEADER ── -->
  <div class="header">
 
    <!-- Left: Logo + Company Info -->
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
 
    <!-- Center: Products image + INVOICE title -->
    <div class="header-invoice">
      <h1>INVOICE</h1>
    </div>
 
    <!-- Right: Details grid -->
    <div class="header-details">
      <div class="header-details-grid">
        <table>
          <tr>
            <td>Invoice #</td>
            <td>${invoiceId || "&nbsp;"}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>${formatDate(orderDate)}</td>
          </tr>
          <tr>
            <td>Sales Person</td>
            <td>${cartItems[0].cart?.salesperson?.name || "&nbsp;"}</td>
          </tr>
        </table>
      </div>
      <div class="gst-bar">GST# 885439468RT0001</div>
    </div>
 
  </div><!-- /header -->
 
  <!-- ── WEBSITE LINE ── -->
  <div class="website-line">
    Visit our website at
    <a href="https://www.newcountryappliances.com">WWW.NEWCOUNTRYAPPLIANCES.COM</a>
  </div>
 
  <!-- ── BILL TO / SHIP TO ── -->
  <div class="address-row">
    <div class="address-box">
  <strong>Bill To:</strong>
  ${customer?.name || "&nbsp;"}<br>
  ${fullAddress || "&nbsp;"}
</div>
<div class="address-box">
  <strong>Ship To:</strong>
  ${customer?.customer_id ? `Customer ${customer.customer_id}<br>` : ""}
  ${fullAddress || "&nbsp;"}
</div>
  </div>
 
  <!-- ── ITEMS TABLE ── -->
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
        <td>${item.nc_number}</td>
<td class="left">
  <strong>${item?.item?.item_id ?? idx + 1}</strong> &nbsp;
  ${item.item.name}
  ${item.item.short_description ? `<span style="color:#444;">${item.item.short_description}</span>` : ""}
</td>
<td>${currencySign}${Number(item.item.msrp).toFixed(2)}</td>
<td>${currencySign}${Number(item.item.msrp) - Number(item.item.price)}</td>
<td>${currencySign}${(Number(item.item.price) * item.quantity).toFixed(2)}</td>
      </tr>
      `).join("")}
      ${Array.from({ length: EMPTY_ROWS }, () => `
      <tr>
        <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
      `).join("")}
    </tbody>
  </table>

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
</div>

<!-- HORIZONTAL TOTALS TABLE -->
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
      <td>${currencySign}${Number(cartItems[0].item.price) + Number(deliveryCharges) + Number(totalEHF) + Number(totalRemovalCharges)}</td>
      ${discount ? `<td>&minus;${currencySign}${Number(discount).toFixed(2)}</td>` : ""}
      <td>${currencySign}${Number(tax5).toFixed(2)}</td>
      <td>${currencySign}${Number(tax7).toFixed(2)}</td>
      ${warranty ? `<td>${currencySign}${Number(warranty).toFixed(2)}</td>` : ""}
      ${isExchangeMode ? `<td>&minus;${currencySign}${Number(originalItemTotal).toFixed(2)}</td>` : ""}
      <td><strong>${currencySign}${Math.abs(Number(total)).toFixed(2)}</strong></td>
      <td>${currencySign}${Math.abs(Number(total)).toFixed(2)}</td>
      <td><strong>${currencySign}${balance.toFixed(2)}</strong></td>
    </tr>
  </tbody>
</table> 
   <!-- ── FOOTER ── -->
  <div class="footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #000; padding-top:6px; margin-top:10px;">
  <div style="font-size:13px; font-weight:900; letter-spacing:0.5px;">
    NOW 19 LOCATIONS TO SERVE YOU
  </div>
  <div style="display:flex; align-items:center; gap:6px; font-size:9px; text-align:center;">
    <div>
      Canadian<br>Home Builders'<br>Association
    </div>
    <img
      src="/images/chba_logo.png"
      alt="Canadian Home Builders' Association"
      style="height:48px; width:48px; object-fit:contain;"
      onerror="this.style.display='none';"
    />
  </div>
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

	// ── Modal UI ──────────────────────────────────────────────────────
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

			<CardComponent p={0} shadow="sm" radius="md" withBorder className="my-3" style={{ flexGrow: 1 }}>
				<ScrollAreaComponent>
					{cartItems.map((item, index) => (
						// eslint-disable-next-line max-len
						<BoxComponent key={index} px={12} py={8} pb={index === cartItems.length - 1 ? 0 : 12}>
							<StackComponent gap="sm" mb="10">
								<GroupComponent justify="space-between">
									<StackComponent gap={0} style={{ flexGrow: 1 }}>
										<GroupComponent justify="space-between">
											{/* eslint-disable-next-line max-len */}
											<TitleComponent fz={14} title={truncateText(item.item.name, 30)} />
											<TitleComponent
												fz={14}
												c="green"
												title={`${currencySign} ${(Number(item.item.price) * item.quantity).toFixed(2)}`}
											/>
										</GroupComponent>
										<TextComponent
											c="gray"
											fz={12}
											text={`${currencySign} ${Number(item.item.price).toFixed(2)} x ${item.quantity}`}
										/>
									</StackComponent>
								</GroupComponent>
								{index !== cartItems.length - 1 && (
									<DividerComponent my={0} mt={6} variant="dashed" p={0} py={0} />
								)}
							</StackComponent>
						</BoxComponent>
					))}
				</ScrollAreaComponent>
			</CardComponent>

			<CardComponent padding="sm" shadow="sm" radius="md" withBorder style={{ height: "auto" }}>
				<StackComponent gap="sm">
					<GroupComponent justify="space-between">
						<TextComponent text="Total:" bold />
						<TextComponent text={`${currencySign} ${Math.abs(total).toFixed(2)}`} bold />
					</GroupComponent>
				</StackComponent>
			</CardComponent>

			<BoxComponent h={60} className="mt-3">
				<GroupComponent grow justify="end">
					<GroupComponent grow justify="space-evenly" style={{ flexGrow: 1 }}>
						<ButtonComponent title="Close" variant="subtle" color={appAccentColorRGBA} onClick={handleCloseModal} />
						<ButtonComponent title="Print" onClick={renderInvoice} />
					</GroupComponent>
				</GroupComponent>
			</BoxComponent>
		</ModalComponent>
	);
};

export default InvoiceModal;
