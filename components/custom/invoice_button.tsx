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
	totalDiscount: number;
	totalEHF: number | undefined;
	fullAddress:string | undefined;
	totalRemovalCharges: number | undefined;
	deliveryCharges: string | number | undefined;
	note: string | undefined;
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
		totalDiscount,
		cartItems,
		note,
		warranty,
	} = props;

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
            font-size: 12px;
            margin: 0; /* Remove default body margin */
            padding: 0; /* Remove default body padding */
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
            margin-bottom: 10px; /* Reduced margin */
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
			max-width: 150px; /* Adjust as needed */
		}

        .invoice-details,
        .totals-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px; /* Reduced margin */
        }

        .invoice-details th,
        .invoice-details td {
            padding: 5px;
            text-align: left;
        }

        .item-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px; /* Reduced margin */
        }

        .item-table th,
        .item-table td {
			border: 1px solid #ccc;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 150px; /* Adjust as needed */
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
            margin-top: 10px; /* Reduced margin */
        }

        /* Remove date and page number from print */
        @media print {
            @page {
                size: auto; /* Auto size */
                margin: 0; /* Remove margin */
            }
            body {
                margin: 0; /* Remove body margin */
                padding: 0; /* Remove body padding */
            }
            .container {
                border: none; /* Remove border */
                padding: 0; /* Remove padding */
            }
            .header, .invoice-details, .item-table, .warranty, .footer {
                margin: 0; /* Remove margins */
                padding: 0; /* Remove padding */
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
                    ncaisales@gmail.com
                </p>
            </div>
            <div class="image_container">
                <h1>INVOICE</h1>
            </div>
            <div class="image_container">
                <a href="mailto:ncaisales@gmail.com"><h4>ncaisales@gmail.com</h4></a>
            </div>
        </div>

        <table class="invoice-details">
            <tr>
                <th>INVOICE DATE:</th>
                <td><strong>${formatDate(orderDate)}</strong></td>
                <th>DELIVERY DATE:</th>
                <td></td>
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
                 <td colspan="3" rowspan="11">
        <strong>All Sales Are Final, No Returns or Refunds:</strong> Please see below for warranty periods. Warranty limited to mechanical parts & labour only. Original invoice must be presented for all repairs and warranty. ($25 Service charge for looking up lost invoices). Warranty work can only be done by us during the warranty period. There will be a $125 service charge if the technician finds that it’s not the product fault. No refunds under any circumstances. Appliance installations are the customer’s sole responsibility. Only qualified individuals must perform all installations. Any damage occurring during installation will not be covered. All products sold by New Country Appliances Inc. have been purchased as re-claimed goods from major manufacturers and carry no manufacturer’s warranty, therefore they are subject to warranty only as mentioned below. Ownership of goods remains with NCAI until paid in full. 2% interest per month on overdue accounts. NCAI is not liable for any consequential damage to any kind of property arising from products sold by us. Subject to jurisdiction of Law Courts in Surrey, BC.
        </td>
                <td>EHF</td>
                <td>${currencySign} ${totalEHF?.toFixed(2)}</td>
            </tr>
            <tr>
                <td>DELIVERY</td>
                <td>${currencySign} ${Number(deliveryCharges).toFixed(2)}</td>
            </tr>
            <tr>
                <td>REMOVAL</td>
                <td>${currencySign} ${Number(totalRemovalCharges).toFixed(2)}</td>
            </tr>
            <tr>
                <td>WARRANTY</td>
                <td>${currencySign} ${Number(warranty).toFixed(2)}</td>
            </tr>
            <tr>
                <td>5% GST</td>
                <td>${currencySign} ${tax5.toFixed(2)}</td>
            </tr>
            <tr>
                <td>7% PST</td>
                <td>${currencySign} ${tax7.toFixed(2)}</td>
            </tr>
            <tr>
                <td>SUBTOTAL</td>
                <td>${currencySign} ${subTotal.toFixed(2)}</td>
            </tr>
            <tr>
                <td>DISCOUNT</td>
                <td>- ${currencySign} ${discount.toFixed(2)}</td>
            </tr>
            <tr>
                <td>TOTAL</td>
                <td><strong>${currencySign} ${total.toFixed(2)}</strong></td>
            </tr>
            <tr>
                <td>DEPOSIT</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>BALANCE</td>
                <td><strong>FALSE</strong></td>
            </tr>
        </table>

        <div class="warranty">
            <p>Additional Note - ${note}</p>
        </div>

        <div class="terms">
            <p>Warranty: Unless specified above. Major Appliances - 1 Year In - Home (within the Lower Mainland, BC. Out of area customers must bring their appliances to the Surrey store for repairs). Extended warranty is provided by 3rd party warranty company. NCAI is not liable for any claims arising during extended warranty period. Microwaves, OTR’s, Vacuums, Air Conditioners, Home Audio & Electronics - 30 Days In-Store. All Clearance items, Line TV’s, Wall Mounts, cables, accessories - As Is, No Warranty.</p>
            <p>PAID ORDERS WILL BE STORED FOR 1 WEEK. STORAGE FEES WILL THEN BE CHARGED.</p>
            <p>Delivery - In order to facilitate the delivery of my shipment, I hereby give permission to the driver to use my driveway, walk, curb, lawn, steps, flooring etc. and hereby exempt New Country Appliances Inc. from responsibility for any damage caused either outside or inside my house by their REASONABLE and PRUDENT use of this authority. It is hereby understood and agreed that New Country Appliances Inc. does not take any responsibility for any loss or damage to my property. I agree to pay a $35 charge if the fridge doors or the house door needs to be removed for delivery.</p>
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
		<ButtonComponent title="Print" onClick={renderInvoice} />
		);
};

export default InvoiceButton;
