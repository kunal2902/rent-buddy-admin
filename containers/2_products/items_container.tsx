"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import {
	MdAdd,
	MdAttachMoney,
	MdFileDownload,
	MdFilterList, MdKeyboardArrowDown, MdKeyboardArrowUp,
	MdOutlineEdit,
	MdOutlineInventory,
	MdOutlineVisibility,
	MdSearch,
	MdWarning,
} from "react-icons/md";
import { Checkbox, Select, TextInput, Tooltip, UnstyledButton, Text } from "@mantine/core";
import {
	ActionIconComponent,
	BoxComponent,
	ButtonComponent,
	GroupComponent,
	LoaderComponent,
	LoadingOverlayComponent,
	MainComponent, MainNavbar, MainSidebar,
	NoDataFound,
	PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	ScrollAreaComponent,
	TableComponent,
	TableTbodyComponent,
	TableTdComponent,
	TableThComponent,
	TableTheadComponent,
	TableTrComponent,
} from "@/components";
import { checkPermissions } from "@/components/custom/check_permission_entities";
import { deleteItemApi, formatDate, getProductApi, logoutUser } from "@/utils";
import AddItemModal, { AddProductModal, initialProductValue, InitialProductValue } from "./add_item_modal";
import ShowNotification from "@/components/mantine/show_notification";

// types
interface ProductModel {
	product_id: string;
	name: string;
	image: string;
	price: number;
	size: number;
	qty: number;
	created_at: string;
	status: "Available" | "Out of Stock";
	category: { name: string; id: string };
}

interface CategoryTab {
	id: string;
	name: string;
	count: number;
}

interface StatsData {
	total_products: number;
	total_products_growth: number;
	low_stock_items: number;
	inventory_value: number;
}

// ─── Status Badge ───────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => (
	<span
		style={{
			padding: "4px 12px",
			borderRadius: 20,
			fontSize: 12,
			fontWeight: 600,
			backgroundColor: status === "Available" ? "#dcfce7" : "#fee2e2",
			color: status === "Available" ? "#16a34a" : "#dc2626",
			whiteSpace: "nowrap",
		}}
	>
		{status}
	</span>
);

// ─── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, accent }: {
	icon: React.ReactNode;
	label: string;
	value: string;
	sub?: React.ReactNode;
	accent?: string;
}) => (
	<PaperComponent
		style={{
			minWidth: "311px",
			minHeight: "146px",
			padding: "16px 20px",
			borderRadius: 12,
			border: `1px solid ${accent ? `${accent}30` : "#e5e7eb"}`,
			backgroundColor: accent ? `${accent}0d` : "#fff",
		}}
	>
		<GroupComponent gap={8} mb={4}>
			<span style={{ color: accent ?? "#6b7280", marginTop: "8px" }}>{icon}</span>
			<Text size="14px" fw="500" c="dimmed" mt="xs">
				{label}
			</Text>
		</GroupComponent>
		<Text fw={600} size="28px" mt="lg">
			{value}
		</Text>
		{sub && (
			<Text size="11px" fw={600} c="dimmed" mt="lg">
				{sub}
			</Text>
		)}
	</PaperComponent>
);

// ─── Main Container ─────────────────────────────────────────────
export const ProductsContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [productList, setProductList] = useState<ProductModel[]>([]);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [orderBy, setOrderBy] = useState<string>("product_id");
	const [order, setOrder] = useState<string>("asc");
	const [pageSize] = useState<number>(10);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [stats, setStats] = useState<StatsData | null>(null);
	const [categories, setCategories] = useState<CategoryTab[]>([]);
	const [activeCategoryId, setActiveCategoryId] = useState<string>("");
	const [expandedRow, setExpandedRow] = useState<string | null>(null); // mobile accordion
	// eslint-disable-next-line max-len
	const [selectedProduct, setSelectedProduct] = useState<InitialProductValue>(initialProductValue);

	const currentQueryRef = useRef(searchValue);

	const canDeleteProduct = checkPermissions("item", ["delete"]);
	const canUpdateProduct = checkPermissions("item", ["update"]);
	const canCreateProduct = checkPermissions("item", ["create"]);

	useEffect(() => {
		initState().then();
	}, [page, callApi, orderBy, order, activeCategoryId]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	useEffect(() => {
		if (searchValue) handleSearch(searchValue);
		else { setSearchLoading(false); initState().then(); }
	}, [searchValue]);

	const buildQuery = (q = searchValue) =>
		`filter_query=${q}&category_id=${activeCategoryId}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`;

	const initState = async () => {
		setLoading(true);
		await getProductApi(
			buildQuery(),
			(data: any) => {
				setProductList(data.products);
				setTotal(data.products_count);
				setStats(data.stats);
				if (data.categories?.length && !activeCategoryId) {
					setCategories(data.categories);
					setActiveCategoryId(data.categories[0].id);
				}
				setLoading(false);
			},
			() => setLoading(false),
			() => { setLoading(false); logoutUser(router); }
		);
	};

	const handleSearch = useDebouncedCallback(async (q: string) => {
		if (q !== currentQueryRef.current) return;
		setSearchLoading(true);
		await getProductApi(
			buildQuery(q),
			(data: any) => { setProductList(data.products); setSearchLoading(false); },
			() => setSearchLoading(false),
			() => { setSearchLoading(false); logoutUser(router); }
		);
	}, 500);

	const handleAddOpenModal = (element: any) => {
		setSelectedProduct(element || initialProductValue);
		setOpenAddModal(true);
	};

	const handleActionProduct = async (id: string, actionType: "delete" | "disable") => {
		if (actionType === "delete") {
			await deleteItemApi(
				id,
				() => { setCallApi(v => !v); ShowNotification("Success", "success"); },
				(err) => { setCallApi(v => !v); ShowNotification(err.error, "error"); },
				() => { setCallApi(v => !v); logoutUser(router); }
			);
		}
		// add disable API when available
	};

	const allSelected =
		productList.length > 0 && selectedIds.length === productList.length;

	const toggleSelectAll = () =>
		setSelectedIds(allSelected ? [] : productList.map(p => p.product_id));

	const toggleSelect = (id: string) =>
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
		);

	// ── Breadcrumb active category name ──
	const activeCat = categories.find(c => c.id === activeCategoryId);

	return (
		<MainComponent>
			<MainNavbar />
			<MainSidebar />

			{openAddModal ? (
				<AddProductModal
					setCallApi={setCallApi}
					initialProductValue={selectedProduct}
					onClose={() => setOpenAddModal(false)}
				/>
			) : (
				<>
					<BoxComponent px="md" pt="xl" pl="xl">
						<Text size="24px">Product</Text>
						<Text size="14px" mt="sm">
							Dashboard &rsaquo; Product{" "}
							{activeCat && (
								<Text component="span" size="xs" c="blue" fw={600}>
									&rsaquo; {activeCat.name} ({activeCat.count})
								</Text>
							)}
						</Text>
					</BoxComponent>
					{/* ── Stats Cards ── */}
					{stats && (
						<GroupComponent px="md" pt="md" pl="xl" gap={20} wrap="wrap">
							<StatCard
								icon={<MdOutlineInventory size={16} />}
								label="Total Products"
								value={stats.total_products.toLocaleString()}
								sub={
									<Text component="span" c="green" fw={600}>
										↑ {stats.total_products_growth}% from last month
									</Text>
								}
							/>
							<StatCard
								icon={<MdWarning size={16} />}
								label="Low Stock Items"
								value={String(stats.low_stock_items)}
								sub="Requires immediate attention"
								accent="#f59e0b"
							/>
							<StatCard
								icon={<MdAttachMoney size={16} />}
								label="Est. Inventory Value"
								value={`$${stats.inventory_value.toLocaleString()}`}
								accent="#6366f1"
							/>
						</GroupComponent>
					)}

					<PaperComponent radius={20} w="98%" style={{ margin: "20px auto" }}>
						<BoxComponent px="md" pt="md" pl="xl">
							<GroupComponent justify="space-between" wrap="wrap" gap={8}>
								{/* Search */}
								<TextInput
									placeholder="Search for id, name product"
									value={searchValue}
									onChange={e => setSearchValue(e.currentTarget.value)}
									leftSection={<MdSearch size={16} />}
									rightSection={searchLoading ? <LoaderComponent size="xs" /> : null}
									style={{ minWidth: 220, flex: 1, maxWidth: 340 }}
								/>
								<GroupComponent gap={8}>
									<ButtonComponent variant="default" leftSection={<MdFilterList size={16} />}>
										Filter
									</ButtonComponent>
									<ButtonComponent variant="default" leftSection={<MdFileDownload size={16} />}>
										Export
									</ButtonComponent>
									{canCreateProduct && (
										<ButtonComponent
											leftSection={<MdAdd size={16} />}
											onClick={() => handleAddOpenModal(null)}
										>
											New Product
										</ButtonComponent>
									)}
								</GroupComponent>
							</GroupComponent>

							{/* ── Category Tabs ── */}
							<ScrollAreaComponent mt="md" style={{ borderBottom: "1px solid #e5e7eb" }}>
								<GroupComponent gap={0} wrap="nowrap">
									{categories.map(cat => (
										<UnstyledButton
											key={cat.id}
											// eslint-disable-next-line max-len
											onClick={() => { setActiveCategoryId(cat.id); setPage(1); }}
											style={{
												padding: "8px 16px",
												borderRadius: activeCategoryId === cat.id ? 8 : 0,
												backgroundColor:
													activeCategoryId === cat.id ? "#3b82f6" : "transparent",
												color: activeCategoryId === cat.id ? "#fff" : "#6b7280",
												fontWeight: activeCategoryId === cat.id ? 600 : 400,
												fontSize: 14,
												whiteSpace: "nowrap",
												transition: "all 0.15s",
											}}
										>
											{cat.name} ({cat.count})
										</UnstyledButton>
									))}
								</GroupComponent>
							</ScrollAreaComponent>
						</BoxComponent>

						{loading ? (
							<LoadingOverlayComponent />
						) : productList.length === 0 ? (
							<NoDataFound />
						) : (
							<BoxComponent px="md" pt="md" pl="xl">

								{/* ── Desktop Table ── */}
								<PaperComponent visibleFrom="sm" style={{ borderRadius: 12, overflow: "hidden" }}>
									<TableComponent>
										<TableTheadComponent>
											<TableTrComponent>
												<TableThComponent w={40}>
													<Checkbox
														checked={allSelected}
														onChange={toggleSelectAll}
													/>
												</TableThComponent>
												{["Product", "Price", "Size", "QTY", "Date", "Status", "Action"].map(col => (
													// eslint-disable-next-line max-len
													<TableThComponent key={col}>{col}</TableThComponent>
												))}
											</TableTrComponent>
										</TableTheadComponent>
										<TableTbodyComponent>
											{productList.map((product, i) => (
												<TableTrComponent key={i}>
													<TableTdComponent>
														<Checkbox
															// eslint-disable-next-line max-len
															checked={selectedIds.includes(product.product_id)}
															// eslint-disable-next-line max-len
															onChange={() => toggleSelect(product.product_id)}
														/>
													</TableTdComponent>
													{/* Product column */}
													<TableTdComponent>
														<GroupComponent gap={10}>
															<BoxComponent
																style={{
																	width: 40,
																	height: 40,
																	borderRadius: 8,
																	backgroundColor: "#f3f4f6",
																	display: "flex",
																	alignItems: "center",
																	justifyContent: "center",
																}}
															>
																{product.image
																	? <img src={product.image} alt={product.name} width={36} height={36} style={{ borderRadius: 6, objectFit: "cover" }} />
																	: <MdOutlineInventory size={20} color="#9ca3af" />
																}
															</BoxComponent>
															<BoxComponent>
																<Text size="xs" c="blue" fw={500}>{product.product_id}</Text>
																<Text size="sm">{product.name}</Text>
															</BoxComponent>
														</GroupComponent>
													</TableTdComponent>
													{/* eslint-disable-next-line max-len */}
													<TableTdComponent>${product.price.toFixed(2)}</TableTdComponent>
													{/* eslint-disable-next-line max-len */}
													<TableTdComponent>{product.size}</TableTdComponent>
													{/* eslint-disable-next-line max-len */}
													<TableTdComponent>{product.qty}</TableTdComponent>
													<TableTdComponent>
														{formatDate(product.created_at)}
													</TableTdComponent>
													<TableTdComponent>
														<StatusBadge status={product.status} />
													</TableTdComponent>
													<TableTdComponent>
														<GroupComponent gap={6}>
															<Tooltip label="View" position="top">
																<ActionIconComponent size="sm" variant="subtle">
																	{/* eslint-disable-next-line max-len */}
																	<MdOutlineVisibility size={16} />
																</ActionIconComponent>
															</Tooltip>
															{canUpdateProduct && (
																<Tooltip label="Edit" position="top">
																	<ActionIconComponent size="sm" variant="subtle">
																		<MdOutlineEdit size={16} />
																	</ActionIconComponent>
																</Tooltip>
															)}
															{canDeleteProduct && (
																<Tooltip label="Delete" position="top">
																	<div>
																		<PopConfirmComponent
																			entityName="product"
																			actionName="delete"
																			onConfirm={() => handleActionProduct(product.product_id, "delete")}
																		/>
																	</div>
																</Tooltip>
															)}
														</GroupComponent>
													</TableTdComponent>
												</TableTrComponent>
											))}
										</TableTbodyComponent>
									</TableComponent>
								</PaperComponent>

								{/* ── Mobile Cards ── */}
								<BoxComponent hiddenFrom="sm">
									{productList.map((product, i) => {
										const isExpanded = expandedRow === product.product_id + i;
										return (
											<PaperComponent
												key={i}
												mb="sm"
												style={{ borderRadius: 12, overflow: "hidden" }}
											>
												{/* Card Header (always visible) */}
												<GroupComponent
													justify="space-between"
													p="sm"
													// eslint-disable-next-line max-len
													onClick={() => setExpandedRow(isExpanded ? null : product.product_id + i)}
													style={{ cursor: "pointer" }}
												>
													<GroupComponent gap={10}>
														<Checkbox
															// eslint-disable-next-line max-len
															checked={selectedIds.includes(product.product_id)}
															// eslint-disable-next-line max-len
															onChange={e => { e.stopPropagation(); toggleSelect(product.product_id); }}
															onClick={e => e.stopPropagation()}
														/>
														<BoxComponent
															style={{
																width: 36,
																height: 36,
																borderRadius: 8,
																backgroundColor: "#f3f4f6",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
															}}
														>
															<MdOutlineInventory size={18} color="#9ca3af" />
														</BoxComponent>
														<BoxComponent>
															<Text size="xs" c="blue" fw={500}>{product.product_id}</Text>
															<Text size="sm" fw={500}>{product.name}</Text>
														</BoxComponent>
													</GroupComponent>
													{isExpanded
														? <MdKeyboardArrowUp size={20} color="#6b7280" />
														: <MdKeyboardArrowDown size={20} color="#6b7280" />
													}
												</GroupComponent>

												{/* Card Body (expanded) */}
												{isExpanded && (
													<BoxComponent px="sm" pb="sm" style={{ borderTop: "1px solid #f3f4f6" }}>
														{[
															{ label: "Price", value: `$${product.price.toLocaleString()}` },
															{ label: "Size", value: String(product.size) },
															{ label: "QTY", value: String(product.qty) },
															{ label: "Date", value: formatDate(product.created_at) },
														].map(row => (
															<GroupComponent
																key={row.label}
																justify="space-between"
																py={6}
																style={{ borderBottom: "1px solid #f9fafb" }}>
																<Text size="sm" c="dimmed">{row.label}</Text>
																<Text size="sm" fw={500}>{row.value}</Text>
															</GroupComponent>
														))}
														<GroupComponent justify="space-between" pt={8} align="center">
															<StatusBadge status={product.status} />
															<GroupComponent gap={6}>
																<ActionIconComponent size="sm" variant="subtle">
																	{/* eslint-disable-next-line max-len */}
																	<MdOutlineVisibility size={16} />
																</ActionIconComponent>
																{canUpdateProduct && (
																	<ActionIconComponent size="sm" variant="subtle">
																		<MdOutlineEdit size={16} />
																	</ActionIconComponent>
																)}
																{canDeleteProduct && (
																	<PopConfirmComponent
																		entityName="product"
																		actionName="delete"
																		onConfirm={() => handleActionProduct(product.product_id, "delete")}
																	/>
																)}
															</GroupComponent>
														</GroupComponent>
													</BoxComponent>
												)}
											</PaperComponent>
										);
									})}
								</BoxComponent>

								{/* ── Pagination ── */}
								<GroupComponent justify="space-between" mt="md" wrap="wrap">
									<Text size="sm" c="dimmed">
										{/* eslint-disable-next-line max-len */}
										1 – {Math.min(pageSize, total)} of {Math.ceil(total / pageSize)} Pages
									</Text>
									<GroupComponent gap={8}>
										<Text size="sm" c="dimmed">The page on</Text>
										<Select
											value={String(page)}
											onChange={v => setPage(Number(v))}
											// eslint-disable-next-line max-len
											data={Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => String(i + 1))}
											style={{ width: 70 }}
											size="xs"
										/>
										<PaginationComponent
											value={page}
											onChange={setPage}
											total={Math.ceil(total / pageSize)}
											siblings={0}
											boundaries={0}
										/>
									</GroupComponent>
								</GroupComponent>
							</BoxComponent>
						)}
					</PaperComponent>

				</>
			)}
		</MainComponent>
	);
};
