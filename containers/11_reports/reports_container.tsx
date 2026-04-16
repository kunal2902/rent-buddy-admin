"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Group, Modal, Table } from "@mantine/core";
import { useRouter } from "next/navigation";
import { MdKeyboardReturn } from "react-icons/md";
import { FaExchangeAlt, FaFileDownload } from "react-icons/fa";
import {
	ActionIconComponent,
	BoxComponent, ButtonComponent,
	CenterComponent,
	DashboardPageHeader, GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent, PopConfirmComponent,
	SortButtonComponentItemProps,
} from "@/components";
import {
	currencySign,
	formatDate,
	getReportsAPI,
	logoutUser,
	updateItemApi,
	updateReportApi,
} from "@/utils";
import { ReportModel } from "@/models";
import InvoiceModal from "@/containers/11_reports/invoice_modal";
import ShowNotification from "@/components/mantine/show_notification";

type InvoiceType = {
	invoice_id: string;
	total_selling_amount: number;
	created_at: string;
	is_returned: boolean;
	is_exchanged: boolean;
	returned_at: string;
	exchanged_at: string;
	transaction_detail: any;
	customer: any;
	invoice_items: any[];
};

const ReportsContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
	const [order, setOrder] = useState<string>("desc");
	const [filter, setFilter] = useState<string>("customer");
	const [pageSize, setPageSize] = useState<number>(15);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [reportsList, setReportsList] = useState<ReportModel[]>([]);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState<boolean>(false);
	const currentQueryRef = useRef(searchValue);
	const [returnLoadingIds, setReturnLoadingIds] = useState<Set<string>>(new Set());
	const [confirmationModal, setConfirmationModal] = useState<{
		open: boolean;
		type: "return" | "exchange" | "";
		invoice: InvoiceType | null;
	}>({
		open: false,
		type: "",
		invoice: null,
	});
	const [returnSlipModal, setReturnSlipModal] = useState<{
		open: boolean;
		invoice: InvoiceType | null;
	}>({
		open: false,
		invoice: null,
	});

	const [exchangeSlipModal, setExchangeSlipModal] = useState<{
		open: boolean;
		invoice: InvoiceType | null;
	}>({
		open: false,
		invoice: null,
	});

	useEffect(() => {
		initState().then();
	}, [filter, page, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		getReportsAPI(
			`orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}&include_exchanges=true`,
			(data: any) => {
				setReportsList(data.reports);
				setTotal(data.reports_count ?? 0);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
				logoutUser(router);
			}
		).then();
	};

	const handleOpenInvoice = (invoice: any) => {
		console.log({ invoice });
		setSelectedInvoice(invoice);
		setInvoiceDialogOpen(true);
	};

	const handleExchange = async (originalInvoice: any) => {
		setConfirmationModal({
			open: true,
			type: "exchange",
			invoice: originalInvoice,
		});
	};

	const confirmExchange = async (originalInvoice: any) => {
		try {
			const exchangeData = {
				id: originalInvoice.invoice_id,
				is_exchanged: true,
			};

			localStorage.setItem("exchangeData", JSON.stringify(exchangeData));

			// Update the report status locally
			const reportUpdateData = {
				is_exchanged: true,
				exchanged_at: new Date().toISOString(),
				is_returned: false,
			};

			setReportsList(prevReports =>
				prevReports.map(report =>
					report.invoice_id === originalInvoice.invoice_id
						// eslint-disable-next-line max-len
						? { ...report, is_exchanged: true, exchanged_at: reportUpdateData.exchanged_at }
						: report
				)
			);

			ShowNotification("Exchange initiated successfully", "success");

			setExchangeSlipModal({
				open: true,
				invoice: { ...originalInvoice, exchanged_at: reportUpdateData.exchanged_at },
			});
		} catch (error) {
			console.error("Exchange error:", error);
			ShowNotification("Failed to initiate exchange", "error");
		} finally {
			setConfirmationModal({ open: false, type: "", invoice: null });
		}
	};

	const handleReturnInvoice = async (invoice: any) => {
		setConfirmationModal({
			open: true,
			type: "return",
			invoice,
		});
	};

	const confirmReturn = async (invoice: any) => {
		setReturnLoadingIds(prev => new Set(prev).add(invoice.invoice_id));

		if (!invoice.invoice_items || invoice.invoice_items.length === 0) {
			ShowNotification("No items to return in this invoice.", "warning");
			setReturnLoadingIds(prev => {
				const newSet = new Set(prev);
				newSet.delete(invoice.invoice_id);
				return newSet;
			});
			setConfirmationModal({ open: false, type: "", invoice: null });
			return;
		}

		try {
			// eslint-disable-next-line max-len
			const updatePromises = invoice.invoice_items.map((invoiceItem: any) => new Promise((resolve, reject) => {
				const itemId = invoiceItem.item_id.toString();
				const quantityToReturn = Number(invoiceItem.quantity);

				// eslint-disable-next-line no-restricted-globals
				if (isNaN(quantityToReturn) || quantityToReturn <= 0) {
					reject(new Error(`Invalid quantity to return for item ${itemId}`));
					return;
				}

				const updateData = {
					increment_stock: quantityToReturn,
				};

				console.log(`API call data for item ${itemId}:`, updateData);
				updateItemApi(
					itemId,
					updateData,
					(data) => resolve(data),
					(error) => reject(error),
					() => {
						logoutUser(router);
						reject(new Error("Unauthorized"));
					}
				);
			}));

			await Promise.all(updatePromises);

			const reportUpdateData = {
				is_returned: true,
				returned_at: new Date().toISOString(),
				is_exchanged: false,
				exchanged_at: new Date().toISOString(),
			};

			await new Promise((resolve, reject) => {
				updateReportApi(
					invoice.invoice_id,
					reportUpdateData,
					(data) => resolve(data),
					(error) => reject(error),
					() => {
						logoutUser(router);
						reject(new Error("Unauthorized"));
					}
				);
			});

			setReportsList(prevReports =>
				prevReports.map(report =>
					report.invoice_id === invoice.invoice_id
						// eslint-disable-next-line max-len
						? { ...report, is_returned: true, returned_at: reportUpdateData.returned_at }
						: report
				)
			);

			ShowNotification("Items returned to inventory successfully", "success");

			// Show return slip modal after successful return
			setReturnSlipModal({
				open: true,
				invoice: { ...invoice, returned_at: reportUpdateData.returned_at },
			});
		} catch (error) {
			ShowNotification("Failed to return items to inventory", "error");
			console.error("Return error:", error);
		} finally {
			setReturnLoadingIds(prev => {
				const newSet = new Set(prev);
				newSet.delete(invoice.invoice_id);
				return newSet;
			});
			setConfirmationModal({ open: false, type: "", invoice: null });
		}
	};

	const columns = [
		"Index",
		"Invoice ID",
		"Total Selling Amount",
		"Customer Name",
		"Address",
		"Phone",
		"Created At",
		"Status",

		"Print Invoice",
		"Actions",
	];

	const rows = reportsList.map((element, index) =>
		(
			<Table.Tr key={index}>
				<Table.Td>{index + 1}</Table.Td>
				<Table.Td>{element.invoice_id}</Table.Td>
				{/* eslint-disable-next-line max-len */}
				<Table.Td>{currencySign} {Number(element.total_selling_amount)?.toFixed(2)}</Table.Td>
				<Table.Td>{element?.customer?.name}</Table.Td>
				<Table.Td>{(element.transaction_detail as any)?.fullAddress || "N/A"}</Table.Td>
				<Table.Td>{element?.customer.phone || "N/A"}</Table.Td>
				<Table.Td>{formatDate(element.created_at)}</Table.Td>
				<Table.Td w="8rem">
					{element.is_returned ? (
						<Badge w="85%" color="orange" variant="filled">Returned</Badge>
					) : element.is_exchanged ? (
						<Badge w="85%" color="blue" variant="filled">Exchanged</Badge>
					) : (
						<Badge w="85%" color="green" variant="filled">Delivered</Badge>
					)}
				</Table.Td>
				<Table.Td>
					<ButtonComponent
						variant="subtle"
						title="Invoice"
						onClick={() => handleOpenInvoice(element)}
				/>
				</Table.Td>
				<Table.Td ta="center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					{element.is_returned || element.is_exchanged ? (
						<ButtonComponent
							variant="subtle"
							color={element.is_returned ? "orange" : "blue"}
							title={`${element.is_returned ? "Return" : "Exchange"} Slip`}
							onClick={() => downloadSlip(element, element.is_returned ? "return" : "exchange")}
							style={{ width: "9rem" }}
						>
						</ButtonComponent>
					) : (
						<GroupComponent>
							<ActionIconComponent
								onClick={() => handleReturnInvoice(element)}
								size="md"
								loading={returnLoadingIds.has(element.invoice_id)}
								bg="orange"
								color="white"
							>
								<MdKeyboardReturn size={18} />
							</ActionIconComponent>
							<ActionIconComponent
								onClick={() => handleExchange(element)}
								size="md"
								bg="blue"
								color="white"
							>
								<FaExchangeAlt size={18} />
							</ActionIconComponent>
						</GroupComponent>
					)}
				</Table.Td>
			</Table.Tr>
	));
	return (
		<>
			<MainComponent>
				<DashboardPageHeader
					total={total}
					buttonTitle=""
					title="Reports"
					filter={filter}
					idLabel="Report Id"
					setFilter={setFilter}
					showAddButton={false}
					idVariable="report_id"
					onClick={() => {
					}}
					loading={searchLoading}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					setOption={(option) => setFilter(option.value)}
					onSortSelected={(selected: SortButtonComponentItemProps) => {
						setOrderBy(selected.value);
						setOrder(selected.direction);
					}}
				/>

				{
					loading ?
						<LoadingOverlayComponent /> :
						reportsList.length === 0 ?
							<NoDataFound /> :
							<BoxComponent style={{ overflow: "hidden" }} className="mx-3">
								<BoxComponent mx="auto">
									<PaperComponent>
										<Table highlightOnHover>
											<Table.Thead>
												<Table.Tr>
													{columns.map((item) =>
														(<Table.Th key={item} ta="center">{item}</Table.Th>)
													)}
												</Table.Tr>
											</Table.Thead>
											<Table.Tbody>{rows}</Table.Tbody>
										</Table>
									</PaperComponent>
									<CenterComponent>
										<PaginationComponent
											value={page}
											onChange={setPage}
											total={Math.ceil(total / 15)}
										/>
									</CenterComponent>
								</BoxComponent>
							</BoxComponent>
				}
			</MainComponent>
			{invoiceDialogOpen && selectedInvoice && (
				<InvoiceModal
					isOpen={invoiceDialogOpen}
					onClose={() => setInvoiceDialogOpen(false)}
					totalRemovalCharges={selectedInvoice.transaction_detail.totalRemovalCharges}
					deliveryCharges={selectedInvoice.transaction_detail.deliveryCharges}
					paymentType={selectedInvoice.transaction_detail.paymentMethod}
					fullAddress={selectedInvoice.transaction_detail.fullAddress}
					totalEHF={selectedInvoice.transaction_detail.totalEHF}
					subTotal={selectedInvoice.transaction_detail.subTotal}
					total={selectedInvoice.transaction_detail.total}
					tax5={selectedInvoice.transaction_detail.tax5}
					tax7={selectedInvoice.transaction_detail.tax7}
					cartItems={selectedInvoice.invoice_items}
					orderDate={selectedInvoice.created_at}
					customer={selectedInvoice.customer}
					warranty={selectedInvoice.transaction_detail.warranty}
				/>
			)}
			{confirmationModal.open && (
				<Modal
					opened={confirmationModal.open}
					onClose={() => setConfirmationModal({ open: false, type: "", invoice: null })}
					title={`Confirm ${confirmationModal.type === "return" ? "Return" : "Exchange"}`}
					centered
					style={{ padding: "2rem" }}
				>
					Are you sure you want to {confirmationModal.type === "return" ? "return" : "exchange"}
					<Group justify="flex-end" gap="sm" mt="lg">
						<Button
							variant="outline"
							onClick={() => setConfirmationModal({ open: false, type: "", invoice: null })}
						>
							Cancel
						</Button>
						<Button
							color="#fa5252"
							onClick={() => {
								if (confirmationModal.type === "return") {
									confirmReturn(confirmationModal.invoice).then();
								} else {
									confirmExchange(confirmationModal.invoice).then();
								}
							}}
							loading={confirmationModal.type === "return" && returnLoadingIds.has(confirmationModal.invoice?.invoice_id as string)}
						>
							Confirm {confirmationModal.type === "return" ? "Return" : "Exchange"}
						</Button>
					</Group>
				</Modal>
			)}

			{exchangeSlipModal.open && exchangeSlipModal.invoice && (
				<Modal
					opened={exchangeSlipModal.open}
					onClose={() => {
						setExchangeSlipModal({ open: false, invoice: null });
						// router.push("/pos");
					}}
					size="lg"
					centered
				>
					<div style={{ padding: "20px", fontFamily: "monospace" }}>
						<div style={{ textAlign: "center", marginBottom: "20px" }}>
							<h2>EXCHANGE SLIP</h2>
							{/* eslint-disable-next-line max-len */}
							<p>Exchange Date: {formatDate(exchangeSlipModal.invoice.exchanged_at)}</p>
						</div>

						<div style={{ marginBottom: "20px" }}>
							<p>Name: {exchangeSlipModal.invoice.customer?.name}</p>
							<p>Phone: {exchangeSlipModal.invoice.customer?.phone || "N/A"}</p>
							<p>Address: {exchangeSlipModal.invoice.transaction_detail?.fullAddress || "N/A"}</p>
						</div>

						<div style={{ marginBottom: "20px" }}>
							<h3>Items for Exchange:</h3>
							<table style={{ width: "100%", borderCollapse: "collapse" }}>
								<thead>
									<tr style={{ borderBottom: "1px solid #ccc" }}>
										<th style={{ textAlign: "left", padding: "8px" }}>Item</th>
										<th style={{ textAlign: "right", padding: "8px" }}>Qty</th>
										<th style={{ textAlign: "right", padding: "8px" }}>Price</th>
										<th style={{ textAlign: "right", padding: "8px" }}>Total</th>
									</tr>
								</thead>
								<tbody>
									{/* eslint-disable-next-line max-len */}
									{exchangeSlipModal.invoice.invoice_items?.map((item: any, index: number) => (
										<tr key={index} style={{ borderBottom: "1px solid #eee" }}>
											<td style={{ padding: "8px" }}>{item.item.name}</td>
											<td style={{ textAlign: "right", padding: "8px" }}>{item.quantity}</td>
											<td style={{ textAlign: "right", padding: "8px" }}>
												{/* eslint-disable-next-line max-len */}
												{currencySign}{Number(item.selling_price).toFixed(2)}
											</td>
											<td style={{ textAlign: "right", padding: "8px" }}>
												{/* eslint-disable-next-line max-len */}
												{currencySign}{(Number(item.quantity) * Number(item.selling_price)).toFixed(2)}
											</td>
										</tr>
								))}
								</tbody>
							</table>
						</div>

						<div style={{ borderTop: "2px solid #000", paddingTop: "10px" }}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<strong>Total Exchange Balance: </strong>
								{/* eslint-disable-next-line max-len */}
								<strong>{currencySign}{Number(exchangeSlipModal.invoice.total_selling_amount).toFixed(2)}</strong>
							</div>
						</div>

						<div style={{ marginTop: "30px", textAlign: "center" }}>
							<p>Proceed to select new items for exchange.</p>
						</div>
					</div>

					<Group justify="flex-end" mt="lg">
						<Button
							variant="outline"
							onClick={() => {
								setExchangeSlipModal({ open: false, invoice: null });
								router.push("/pos");
							}}
						>
							Open Pos
						</Button>
						<Button
							onClick={() => window.print()}
						>
							Print Exchange Slip
						</Button>
					</Group>
				</Modal>
			)}

			{/* Return Slip Modal */}
			{returnSlipModal.open && returnSlipModal.invoice && (
				<Modal
					opened={returnSlipModal.open}
					onClose={() => setReturnSlipModal({ open: false, invoice: null })}
					size="lg"
					centered
				>
					<div style={{ padding: "10px", fontFamily: "monospace" }}>
						<div style={{ textAlign: "center", marginBottom: "20px" }}>
							<h2>RETURN SLIP</h2>
							{/*<p>Invoice ID: #{returnSlipModal.invoice.invoice_id}</p>*/}
							<p>Return Date: {formatDate(returnSlipModal.invoice.returned_at)}</p>
						</div>

						<div style={{ marginBottom: "20px" }}>
							{/*<h3>Customer Information:</h3>*/}
							<p>Name: {returnSlipModal.invoice.customer?.name}</p>
							<p>Phone: {returnSlipModal.invoice.customer?.phone || "N/A"}</p>
							<p>Address: {returnSlipModal.invoice.transaction_detail?.fullAddress || "N/A"}</p>
						</div>

						<div style={{ marginBottom: "20px" }}>
							{/*<h3>Returned Items:</h3>*/}
							<table style={{ width: "100%", borderCollapse: "collapse" }}>
								<thead>
									<tr style={{ borderBottom: "1px solid #ccc" }}>
										<th style={{ textAlign: "left", padding: "8px" }}>Item</th>
										<th style={{ textAlign: "right", padding: "8px" }}>Qty</th>
										<th style={{ textAlign: "right", padding: "8px" }}>Price</th>
										<th style={{ textAlign: "right", padding: "8px" }}>Total</th>
									</tr>
								</thead>
								<tbody>
									{/* eslint-disable-next-line max-len */}
									{returnSlipModal.invoice?.invoice_items?.map((item: any, index: number) => (
										<tr key={index} style={{ borderBottom: "1px solid #eee" }}>
											<td style={{ padding: "8px" }}>{item.item.name}</td>
											<td style={{ textAlign: "right", padding: "8px" }}>{item.quantity}</td>
											<td style={{ textAlign: "right", padding: "8px" }}>
												{/* eslint-disable-next-line max-len */}
												{currencySign}{Number(item.selling_price).toFixed(2)}
											</td>
											<td style={{ textAlign: "right", padding: "8px" }}>
												{/* eslint-disable-next-line max-len */}
												{currencySign}{(Number(item.quantity) * Number(item.selling_price)).toFixed(2)}
											</td>
										</tr>
								))}
								</tbody>
							</table>
						</div>

						<div style={{ borderTop: "2px solid #000", paddingTop: "10px" }}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<strong>Total Return Amount: </strong>
								{/* eslint-disable-next-line max-len */}
								<strong>{currencySign}{Number(returnSlipModal.invoice.total_selling_amount).toFixed(2)}</strong>
							</div>
						</div>
					</div>

					<Group justify="flex-end" mt="lg">
						<Button
							variant="outline"
							onClick={() => setReturnSlipModal({ open: false, invoice: null })}
						>
							Close
						</Button>
						<Button
							onClick={() => window.print()}
						>
							Print
						</Button>
					</Group>
				</Modal>
			)}
		</>
	);
};

const downloadSlip = (invoice: any, type: "return" | "exchange") => {
	const slipHTML = generateSlipHTML(invoice, type);

	const printWindow = window.open("", "_blank");
	if (printWindow) {
		printWindow.document.write(slipHTML);
		printWindow.document.close();
	}
};

const generateSlipHTML = (invoice: any, type: "return" | "exchange") => {
	const date = type === "return" ? invoice.returned_at : invoice.exchanged_at;
	const title = type === "return" ? "RETURN SLIP" : "EXCHANGE SLIP";
	const actionText = type === "return" ? "Returned" : "Exchanged";

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const formatDate = (dateString: string) => {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		} as const;
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const currencySign = "$";

	return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: monospace; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .info-section { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; text-align: left; }
        th { border-bottom: 1px solid #ccc; }
        .total-section { border-top: 2px solid #000; padding-top: 10px; display: flex; justify-content: space-between; }
        .footer { margin-top: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>${title}</h2>
        <p>Invoice ID: #${invoice.invoice_id}</p>
        <p>${actionText} Date: ${formatDate(date)}</p>
      </div>

      <div class="info-section">
        <p>Name: ${invoice.customer?.name || "N/A"}</p>
        <p>Phone: ${invoice.customer?.phone || "N/A"}</p>
        <p>Address: ${invoice.transaction_detail?.fullAddress || "N/A"}</p>
      </div>

      <div class="info-section">
        <h3>${actionText} Items:</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoice_items?.map((item: any) => `
              <tr>
                <td>${item.item.name}</td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">${currencySign}${Number(item.selling_price).toFixed(2)}</td>
                <td style="text-align: right;">${currencySign}${(Number(item.quantity) * Number(item.selling_price)).toFixed(2)}</td>
              </tr>
            `).join("") || ""}
          </tbody>
        </table>
      </div>

      <div class="total-section">
        <strong>Total ${actionText} Amount: </strong>
        <strong>${currencySign}${Number(invoice.total_selling_amount).toFixed(2)}</strong>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <small>This is a computer generated ${type} slip.</small>
      </div>
      
      <script>
         window.onload = function() {
           window.print();
       \
         };
      </script>
    </body>
    </html>
  `;
};
export default ReportsContainer;
