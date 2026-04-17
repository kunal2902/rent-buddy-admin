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
	totalRemovalCharges: number;
	fullAddress?: string;
	deliveryCharges?: string | number;
	paymentType: string;
	customer: CustomerModel;
	cartItems: CartItemModel[];
	warranty: number;
	description: string;
}

const InvoiceModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		total,
		tax5,
		tax7,
		totalEHF = 0,
		orderDate,
		fullAddress = "N/A",
		deliveryCharges = 0,
		totalRemovalCharges,
		paymentType,
		customer,
		cartItems,
		warranty,
		description,
	} = props;

	const handleCloseModal = () => onClose();

	const truncateText = (text: string, maxLength: number): string =>
		text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

	const balance = Math.max(0, total); // ← FIX: was re-using raw `total` which coerced to false

	const renderInvoice = () => {
		const invoiceWindow = window.open("", "_blank", "width=850,height=1000");
		if (!invoiceWindow) {
			console.log("Unable to open a new window. Please disable your popup blocker and try again.");
			return;
		}

		const EMPTY_ROWS = Math.max(0, 8 - cartItems.length);

		invoiceWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 10px;
      font-size: 12px;
    }
    .container {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
    }

    /* ── HEADER ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      border: 2px solid black;
      padding: 8px 10px;
      margin-bottom: 6px;
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
      width: 90px;
      height: 90px;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
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
      flex: 0 0 auto;
      width: 100%;
      text-align: right;
      font-size: 11px;
      line-height: 1.6;
      margin-top: 10px;
    }
    .contact-info .field-label { font-weight: bold; }

    /* ── INVOICE DATE ROW ── */
    .invoice-date-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 11px;
    }
    .invoice-date-row span { font-weight: bold; }

    /* ── ITEMS TABLE ── */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0;
      border: 2px solid black;
    }
    .items-table th {
      background-color: #f0f0f0;
      border: 1px solid black;
      padding: 6px 4px;
      text-align: center;
      font-weight: bold;
      font-size: 11px;
    }
    .items-table td {
      border: 1px solid black;
      padding: 5px 4px;
      text-align: center;
      font-size: 11px;
    }
    .items-table td.desc { text-align: left; padding-left: 6px; }

    /* ── BOTTOM SECTION ── */
    .bottom-section {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-top: 8px;
    }
    .warranty-col {
      flex: 1 1 55%;
      font-size: 8.5px;
      line-height: 1.25;
    }
    .warranty-title {
      font-weight: bold;
      margin-bottom: 4px;
      font-size: 9px;
    }
    .payment-table {
      width: 100%;
      border: 2px solid black;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .payment-table td {
      border: 1px solid black;
      padding: 4px 6px;
      font-size: 11px;
    }
    .payment-table .label-col {
      font-weight: bold;
      background-color: #f0f0f0;
    }

    .totals-col {
      flex: 0 0 auto;
      width: 42%;
    }
    .totals-table {
      width: 100%;
      border: 2px solid black;
      border-collapse: collapse;
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
    }
    .totals-table .amount-col {
      text-align: right;
      min-width: 80px;
    }
    .delivery-date-row {
    display: flex;
    flex-direction: column;
    align-items: end;
    }

    /* ── GST ── */
    .gst-number {
      text-align: center;
      font-size: 10px;
      font-weight: bold;
      margin: 8px 0 4px;
    }

    /* ── TERMS ── */
    .terms-section {
      font-size: 8.5px;
      line-height: 1.2;
      margin-bottom: 10px;
    }
    .terms-section p { margin: 4px 0; }
    .signature-line { margin: 6px 0; font-size: 10px; }

    /* ── FOOTER ── */
    .footer {
      text-align: center;
      font-size: 10px;
      font-weight: bold;
      margin-top: 10px;
      border-top: 1px solid black;
      padding-top: 6px;
    }
  </style>
</head>
<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <div class="company-info">
      <strong>New Country Appliances Inc.</strong><br>
      13533 78 Avenue<br>
      Surrey, BC. V3W 0A8<br>
      Phone: 604-593-6890<br>
      Fax: 604-593-1289<br>
      <a href="https://www.newcountryappliances.com">www.newcountryappliances.com</a>
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

  <!-- INVOICE DATE ROW -->
  <div class="invoice-date-row">
    <div><span>INVOICE DATE:</span> ${formatDate(orderDate)}</div>
    <div class="delivery-date-row">
    <strong>DELIVERY DATE: _______________</strong> 
    <div class="contact-info">
      <span class="field-label">SHIP TO:</span>
      ${fullAddress}
    </div>
    </div> 
  </div>
    
     

  <!-- ITEMS TABLE (5 columns) -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width:10%;">QUANTITY</th>
        <th style="width:30%;">ITEM </th>
        <th style="width:40%;">DESCRIPTION </th>
        <th style="width:10%;">UNIT COST</th>
        <th style="width:10%;">AMOUNT</th>
      </tr>
    </thead>
    <tbody>
      ${cartItems.map((item) => `
      <tr>
        <td>${item.quantity}</td>
        <td class="desc">${item.item.name}</td>
        <td>${description}</td>
        <td>${currencySign}${Number(item.item.price).toFixed(2)}</td>
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

  <!-- BOTTOM: WARRANTY + TOTALS -->
  <div class="bottom-section">
    <div class="warranty-col">
      <div class="warranty-title">All Sales are Final, No Returns or Refunds.</div>
      Please see below for warranty periods. Warranty limited to mechanical parts &amp; labour only.
      Original invoice must be presented for all repairs and warranty. ($25 Service charge for looking
      up lost invoices). Warranty work can only be done by us during the warranty period. There will be
      a $125 service charge if the technician finds that it's not the product fault. No refunds under
      any circumstances. Appliance installations are the customer's sole responsibility. Only qualified
      individuals must perform all installations. Any damage occurring during installation will not be
      covered. All products sold by New Country Appliances Inc. have been purchased as re-claimed goods
      from major manufacturers and carry no manufacturer's warranty, therefore they are subject to
      warranty only as mentioned below. Ownership of goods remains with NCAI until paid in full. 2%
      interest per month on overdue accounts. NCAI is not liable for any consequential damage to any
      kind of property arising from products sold by us. Subject to jurisdiction of Law Courts in Surrey, BC.

      <table class="payment-table">
        <tr>
          <td class="label-col">METHOD OF PAYMENT</td>
          <td>${paymentType}</td>
        </tr>
      </table>

      <div class="gst-number">GST # 885439468RT0001</div>
    </div>

    <div class="totals-col">
      <table class="totals-table">
        <tr>
          <td class="label-col">EHF</td>
          <td class="amount-col">${currencySign}${totalEHF.toFixed(2)}</td>
        </tr>
        <tr>
          <td class="label-col">DELIVERY</td>
          <td class="amount-col">${currencySign}${Number(deliveryCharges).toFixed(2)}</td>
        </tr>
        <tr>
          <td class="label-col">REMOVAL</td>
          <td class="amount-col">${currencySign}${totalRemovalCharges.toFixed(2)}</td>
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
        ${
			warranty ? `<tr>
				<td class="label-col">Warranty</td>
				<td class="amount-col">${currencySign}${warranty}</td>
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

  <!-- TERMS -->
  <div class="terms-section">
    <p><strong>Warranty:</strong> Unless specified above. Major Appliances - 1 Year In-Home (within
    the Lower Mainland, BC. Out of area customers must bring their appliances to the Surrey store for
    repairs). Extended warranty is provided by 3rd party warranty company. NCAI is not liable for any
    claims arising during extended warranty period. Microwaves, OTR's, Vacuums, Air Conditioners,
    Home Audio &amp; Electronics - 30 Days In-Store. All Clearance items, Line TV's, Wall Mounts,
    cables, accessories - As Is, No Warranty.</p>
    <p><strong>PAID ORDERS WILL BE STORED FOR 1 WEEK. STORAGE FEES WILL THEN BE CHARGED.</strong></p>
    <p><strong>Delivery -</strong> In order to facilitate the delivery of my shipment, I hereby give
    permission to the driver to use my driveway, walk, curb, lawn, steps, flooring etc, and hereby
    exempt New Country Appliances Inc. from responsibility for any damage caused either outside or
    inside my house by their REASONABLE and PRUDENT use of this authority. It is hereby understood
    and agreed that New Country Appliances Inc. does not take any responsibility for any loss or
    damage to my property. I agree to pay a $35 charge if the fridge doors or the house door needs
    to be removed for delivery.</p>
    <div class="signature-line">
      I agree with warranty &amp; delivery terms &amp; conditions. _______________________ (Customer)
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    THANK-YOU FOR SUPPORTING OUR BUSINESS, SEE YOU AGAIN<br>
    WESTERN CANADA'S LARGEST SCRATCH &amp; DENT APPLIANCE &amp; ELECTRONICS DEALER
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

	// ── Modal UI (unchanged) ──────────────────────────────────────────
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
