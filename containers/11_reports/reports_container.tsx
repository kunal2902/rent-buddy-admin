"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge, Table } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
	BoxComponent, ButtonComponent,
	CenterComponent,
	DashboardPageHeader, GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent,
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
		try {
			const exchangeData = {
				id: originalInvoice.invoice_id,
				is_exchanged: true,
			};

			localStorage.setItem("exchangeData", JSON.stringify(exchangeData));

			// Don't update the report status here - wait until exchange is complete
			router.push("/pos");
		} catch (error) {
			console.error("Exchange error:", error);
			ShowNotification("Failed to initiate exchange", "error");
		}
	};

	const handleReturnInvoice = async (invoice: any) => {
		setReturnLoadingIds(prev => new Set(prev).add(invoice.invoice_id));

		if (!invoice.invoice_items || invoice.invoice_items.length === 0) {
			ShowNotification("No items to return in this invoice.", "warning");
			// Remove invoice ID from loading set
			setReturnLoadingIds(prev => {
				const newSet = new Set(prev);
				newSet.delete(invoice.invoice_id);
				return newSet;
			});
			return;
		}

		try {
			// eslint-disable-next-line max-len
			const updatePromises = invoice.invoice_items.map((invoiceItem: any) => new Promise((resolve, reject) => {
					// Ensure item_id is a string, as required by your API
					const itemId = invoiceItem.item_id.toString();

					const quantityToReturn = Number(invoiceItem.quantity);
					// eslint-disable-next-line no-restricted-globals
					if (isNaN(quantityToReturn) || quantityToReturn <= 0) {
						// Reject the promise with an error for invalid quantity
						reject(new Error(`Invalid quantity to return for item ${itemId}`));
						return;
					}

					const updateData = {
						increment_stock: quantityToReturn,
						is_returned: true,
						returned_at: new Date().toISOString(),
						returned_from_invoice: invoice.invoice_id,
					};

					// Call the API function with the defined callbacks
					updateItemApi(
						itemId,
						updateData,
						(data) => {
							resolve(data);
						},
						(error) => {
							reject(error);
						},
						() => {
							logoutUser(router);
							reject(new Error("Unauthorized"));
						}
					);
				}));

			await Promise.all(updatePromises);

			const reportUpdateData = {
				is_returned: false, // Add this
				returned_at: new Date().toISOString(), // Add this (even though not returned)
				is_exchanged: true,
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
		} catch (error) {
			ShowNotification("Failed to return items to inventory", "error");
			console.error("Return error:", error);
		} finally {
			setReturnLoadingIds(prev => {
				const newSet = new Set(prev);
				newSet.delete(invoice.invoice_id);
				return newSet;
			});
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
				<Table.Td>
					{element.is_returned ? (
						<Badge color="orange" variant="filled">Returned</Badge>
					) : element.is_exchanged ? (
						<Badge color="blue" variant="filled">Exchanged</Badge>
					) : (
						<Badge color="green" variant="filled">Delivered</Badge>
					)}
				</Table.Td>
				<Table.Td>
					<ButtonComponent
						variant="subtle"
						title="Invoice"
						onClick={() => handleOpenInvoice(element)}
				/>
				</Table.Td>
				<Table.Td>
					<GroupComponent>
						<ButtonComponent
							variant="outline"
							title="Return"
							color="orange"
							size="sm"
							loading={returnLoadingIds.has(element.invoice_id)}
							disabled={element.is_returned || element.is_exchanged}
							onClick={() => handleReturnInvoice(element)}
						/>
						<ButtonComponent
							variant="outline"
							title="Exchange"
							color="blue"
							size="sm"
							disabled={element.is_returned || element.is_exchanged}
							onClick={() => handleExchange(element)}
						/>
					</GroupComponent>
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
														(<Table.Th key={item}>{item}</Table.Th>)
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
				/>
			)}
		</>
	);
};

export default ReportsContainer;
