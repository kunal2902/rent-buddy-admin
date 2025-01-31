"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { Table } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
	BoxComponent, ButtonComponent,
	CenterComponent,
	DashboardPageHeader,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent,
	SortButtonComponentItemProps,
} from "@/components";
import { currencySign, formatDate, getReportsAPI, logoutUser } from "@/utils";
import { ReportModel } from "@/models";
import InvoiceModal from "@/containers/11_reports/invoice_modal";

const ReportsContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
	const [order, setOrder] = useState<string>("desc");
	const [filter, setFilter] = useState<string>("name");
	const [pageSize, setPageSize] = useState<number>(15);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [reportsList, setReportsList] = useState<ReportModel[]>([]);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState<boolean>(false);
	const currentQueryRef = useRef(searchValue);

	useEffect(() => {
		initState().then();
	}, [filter, page, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		getReportsAPI(
			`orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
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

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		} else {
			setSearchLoading(false);
			initState().then();
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		if (query === currentQueryRef.current) {
			setSearchLoading(true);
			getReportsAPI(
				`filter_type=${filter}&filter_query=${query}`,
				(data: any) => {
					setReportsList(data.reports);
					setTotal(data.reports_count ?? 0);
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
					logoutUser(router);
				}
			).then();
		}
	}, 500);

	const handleOpenInvoice = (invoice: any) => {
		console.log({ invoice });
		setSelectedInvoice(invoice);
		setInvoiceDialogOpen(true);
	};

	const columns = [
		"Index",
		"Invoice ID",
		"Total Selling Amount",
		"Customer Name",
		"Created At",
		"Print Invoice",
	];

	const rows = reportsList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.invoice_id}</Table.Td>
			<Table.Td>{currencySign} {Number(element.total_selling_amount)?.toFixed(2)}</Table.Td>
			<Table.Td>{element?.customer?.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<ButtonComponent
					variant="subtle"
					title="Invoice"
					onClick={() => handleOpenInvoice(element)}
				/>
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
