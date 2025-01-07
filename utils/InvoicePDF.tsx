import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define types for the props
interface InvoicePDFProps {
	customerName: string;
	orderDate: string;
	paymentMethod: string;
	cartItems: { name: string; price: number; quantity: number }[];
	subTotal: number;
	taxOnBill: number;
}

// Styles for the PDF
const styles = StyleSheet.create({
	page: {
		padding: 20,
		fontFamily: "Helvetica",
	},
	section: {
		marginBottom: 10,
	},
	header: {
		fontSize: 14,
		fontWeight: "bold",
	},
	body: {
		marginBottom: 20,
	},
	itemRow: {
		display: "flex",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	totalRow: {
		fontWeight: "bold",
		marginTop: 10,
	},
});

// InvoicePDF component
const InvoicePDF: React.FC<InvoicePDFProps> = ({
   customerName,
   orderDate,
   paymentMethod,
   cartItems,
   subTotal,
   taxOnBill,
   }) => (
	<Document>
		<Page style={styles.page}>
			<View style={styles.section}>
				<Text style={styles.header}>Invoice</Text>
				<Text>Customer Name: {customerName}</Text>
				<Text>Order Date: {orderDate}</Text>
				<Text>Payment Method: {paymentMethod}</Text>
			</View>

			<View style={styles.body}>
				<Text style={styles.header}>Items</Text>
				{cartItems.map((item, index) => (
					<View key={index} style={styles.itemRow}>
						<Text>{item.name}</Text>
						<Text>{`$${item.price * item.quantity}`}</Text>
					</View>
))}
			</View>

			<View style={styles.totalRow}>
				<Text>Sub Total: ${subTotal}</Text>
				<Text>Tax: ${taxOnBill}</Text>
			</View>
		</Page>
	</Document>
);

export default InvoicePDF;
