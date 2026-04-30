"use client";

import {
	useState,
	useRef,
	useEffect,
	useCallback,
} from "react";
import {
	Search,
	Filter,
	Download,
	Plus,
	Eye,
	Pencil,
	Trash2,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
} from "lucide-react";
import { useRecoilValue } from "recoil";
import { twMerge } from "tailwind-merge";
import { deleteCustomerApi, getCustomerApi, sidebarStateAtom } from "@/utils";

export default function CustomersContainer() {
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("customer_id");
	const [filter] = useState("name");
	const [loading, setLoading] = useState(true);
	const [searchValue, setSearchValue] = useState("");
	const [searchLoading, setSearchLoading] = useState(false);
	const [customersList, setCustomersList] = useState([]);
	const [selected, setSelected] = useState([]);
	const [expandedRow, setExpandedRow] = useState(null);
	const [callApi, setCallApi] = useState(true);
	const PAGE_SIZE = 10;
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	const currentQueryRef = useRef(searchValue);
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	// ── Helpers ──────────────────────────────────────────────────────────────────

	const logoutUser = () => console.warn("Session expired — logging out");

	function SkeletonRow({ cols }) {
		return (
			<tr className="border-b border-gray-50">
				{Array.from({ length: cols }).map((_, i) => (
					<td key={i} className="px-3.5 py-4">
						<div className="h-3.5 bg-gray-100 rounded animate-pulse" />
					</td>
				))}
			</tr>
		);
	}

	function MobileSkeletonRow() {
		return (
			<div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
				<div className="w-4 h-4 bg-gray-100 rounded animate-pulse flex-shrink-0" />
				<div className="flex-1 space-y-2">
					<div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
					<div className="h-3.5 bg-gray-100 rounded animate-pulse w-1/2" />
				</div>
			</div>
		);
	}

	function Pagination({ page, totalPages, total, onPageChange }) {
		const rangeEnd = Math.min(page * PAGE_SIZE, total);
		const rangeStart = Math.min((page - 1) * PAGE_SIZE + 1, rangeEnd);
		return (
			<div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
				<span className="text-xs text-gray-500">
					{rangeStart} – {rangeEnd} of {totalPages} Pages
				</span>
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-500 hidden sm:inline">The page on</span>
					<select
						value={page}
						onChange={(e) => onPageChange(Number(e.target.value))}
						className="border border-gray-200 rounded-md text-xs py-1 pl-2 pr-5 bg-white
                     text-gray-700 cursor-pointer appearance-none outline-none"
						style={{
							backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%236b7280' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "right 6px center",
						}}
					>
						{Array.from({ length: totalPages }, (_, i) => (
							<option key={i + 1} value={i + 1}>{i + 1}</option>
						))}
					</select>
					{/* eslint-disable-next-line react/button-has-type */}
					<button
						disabled={page === 1}
						onClick={() => onPageChange(Math.max(1, page - 1))}
						className="inline-flex items-center justify-center w-7 h-7 rounded-md border
                     border-gray-200 bg-white text-gray-600 hover:bg-gray-50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
					>
						<ChevronLeft size={14} />
					</button>
					{/* eslint-disable-next-line react/button-has-type */}
					<button
						disabled={page === totalPages}
						onClick={() => onPageChange(Math.min(totalPages, page + 1))}
						className="inline-flex items-center justify-center w-7 h-7 rounded-md border
                     border-gray-200 bg-white text-gray-600 hover:bg-gray-50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
					>
						<ChevronRight size={14} />
					</button>
				</div>
			</div>
		);
	}

	function SortButton({ label, col, sortCol, onSort }) {
		const active = sortCol === col;
		return (
			// eslint-disable-next-line react/button-has-type
			<button
				onClick={() => onSort(col)}
				className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide
                 text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer
                 whitespace-nowrap p-0"
			>
				{label}
				<ArrowUpDown size={12} className={active ? "text-blue-600" : "text-gray-400"} />
			</button>
		);
	}

	function ActionButtons({ onView, onEdit, onDelete }) {
		return (
			<div className="flex items-center gap-0.5">
				{/* eslint-disable-next-line react/button-has-type */}
				<button
					onClick={onView}
					title="View"
					className="inline-flex items-center p-1.5 rounded-md text-gray-500
                   hover:bg-gray-100 hover:text-gray-700 transition-colors
                   bg-transparent border-none cursor-pointer"
				>
					<Eye size={15} />
				</button>
				{/* eslint-disable-next-line react/button-has-type */}
				<button
					onClick={onEdit}
					title="Edit"
					className="inline-flex items-center p-1.5 rounded-md text-gray-500
                   hover:bg-gray-100 hover:text-gray-700 transition-colors
                   bg-transparent border-none cursor-pointer"
				>
					<Pencil size={15} />
				</button>
				{/* eslint-disable-next-line react/button-has-type */}
				<button
					onClick={onDelete}
					title="Delete"
					className="inline-flex items-center p-1.5 rounded-md text-gray-500
                   hover:bg-red-50 hover:text-red-500 transition-colors
                   bg-transparent border-none cursor-pointer"
				>
					<Trash2 size={15} />
				</button>
			</div>
		);
	}

	function useDebouncedCallback(fn: unknown, delay: unknown) {
		const timer = useRef(null);
		return useCallback(
			(...args: any) => {
				clearTimeout(timer.current);
				timer.current = setTimeout(() => fn(...args), delay);
			},
			[fn, delay],
		);
	}

	const buildQuery = useCallback(
		(overrides = {}) => {
			const q = {
				filter_type: filter,
				filter_query: searchValue,
				orderBy,
				order,
				page,
				page_size: PAGE_SIZE,
				page_offset: (page - 1) * PAGE_SIZE,
				...overrides,
			};
			return Object.entries(q)
				.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
				.join("&");
		},
		[filter, searchValue, orderBy, order, page],
	);

	const fetchCustomers = useCallback(
		async (query: string, { isSearch = false } = {}) => {
			isSearch ? setSearchLoading(true) : setLoading(true);
			await getCustomerApi(
				query,
				(data) => {
					setCustomersList(data.customers);
					setTotal(data.count);
					isSearch ? setSearchLoading(false) : setLoading(false);
				},
				() => {
					isSearch ? setSearchLoading(false) : setLoading(false);
				},
				() => {
					isSearch ? setSearchLoading(false) : setLoading(false);
					logoutUser();
				},
			);
		},
		[],
	);

	// ── Effects ──────────────────────────────────────────────────────────────────

	// Reload on sort / page / callApi toggle (skip when a search is active)
	useEffect(() => {
		if (!searchValue) fetchCustomers(buildQuery());
	}, [filter, page, callApi, orderBy, order]);

	// Keep ref in sync with latest search string
	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	// Debounced search effect
	const handleSearch = useDebouncedCallback(async (query) => {
		if (query !== currentQueryRef.current) return;
		if (!query) {
			setSearchLoading(false);
			fetchCustomers(buildQuery({ filter_query: "", page: 1 }));
			return;
		}
		await fetchCustomers(
			buildQuery({ filter_query: query, page: 1 }),
			{ isSearch: true },
		);
	}, 500);

	useEffect(() => {
		handleSearch(searchValue);
	}, [searchValue]);

	// ── Actions ──────────────────────────────────────────────────────────────────

	const handleSort = (col) => {
		if (orderBy === col) setOrder((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setOrderBy(col);
			setOrder("asc");
		}
	};

	const handleDelete = async (id) => {
		await deleteCustomerApi(
			id,
			() => setCallApi((v) => !v),
			(err) => {
				console.error(err);
				setCallApi((v) => !v);
			},
			logoutUser,
		);
	};

	const toggleSelect = (i) =>
		setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

	const toggleAll = () =>
		setSelected((s) =>
			s.length === customersList.length ? [] : customersList.map((_, i) => i),
		);

	// ── Render ───────────────────────────────────────────────────────────────────

	const allSelected = customersList.length > 0 && selected.length === customersList.length;

	return (
		<>
			<div className={twMerge(
				"min-h-screen bg-gray-50",
				"transition-[padding] duration-300 ease-in-out", // ← animates with sidebar
				"pt-[60px]", // ← clears MainNavbar h-[60px]
				isSidebarOpen ? "md:pl-64" : "md:pl-[56px]", // ← tracks sidebar w-64 / w-[56px],
			)}>

				{/* ── Page Header ── */}
				<div className="pt-6 pb-2">
					<h1 className="text-2xl font-bold text-gray-900 m-0 leading-tight">Customer</h1>
					<div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
						<span>Dashboard</span>
						<ChevronRight size={12} className="text-gray-300" />
						<span className="text-blue-600">Customer</span>
					</div>
				</div>

				{/* ── Toolbar ── */}
				<div className="flex items-center gap-2.5 mt-4 mb-4 flex-wrap">

					{/* Search — desktop only */}
					<div className="relative flex-1 min-w-[220px] hidden md:flex items-center">
						<Search
							size={14}
							className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
						/>
						<input
							type="text"
							placeholder="Search for id, name Customer"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-sm
                         text-gray-700 bg-white outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
						/>
						{searchLoading && (
							<div className="absolute right-2.5 top-1/2 -translate-y-1/2">
								<div
									className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
							</div>
						)}
					</div>

					<div className="flex-1 hidden md:block" />

					{/* eslint-disable-next-line react/button-has-type */}
					<button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm
                             font-medium border border-gray-200 bg-white text-gray-700
                             hover:bg-gray-50 transition-colors cursor-pointer">
						<Filter size={14} />
						Filter
					</button>

					{/* eslint-disable-next-line react/button-has-type */}
					<button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm
                             font-medium border border-gray-200 bg-white text-gray-700
                             hover:bg-gray-50 transition-colors cursor-pointer">
						<Download size={14} />
						Export
					</button>

					{/* eslint-disable-next-line react/button-has-type */}
					<button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm
                             font-medium border border-blue-600 bg-blue-600 text-white
                             hover:bg-blue-700 transition-colors cursor-pointer">
						<Plus size={14} />
						Add Customer
					</button>
				</div>
				<div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full border-collapse table-fixed">
							<colgroup>
								<col className="w-11" />
								<col className="w-[22%]" />
								<col className="w-[20%]" />
								<col className="w-[10%]" />
								<col className="w-[11%]" />
								<col className="w-[25%]" />
								<col className="w-28" />
							</colgroup>

							<thead>
								<tr className="border-b border-gray-100 bg-gray-50">
									{/* Select-all */}
									<th className="px-3.5 py-3 text-left">
										<input
											type="checkbox"
											className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
											checked={allSelected}
											onChange={toggleAll}
									/>
									</th>

									{[
									{ label: "Name Customer", col: "name" },
									{ label: "Contact", col: "email" },
									{ label: "Purchases", col: "purchases" },
									{ label: "Order QTY", col: "order_qty" },
									{ label: "Address", col: "address" },
								].map(({ label, col }) => (
									<th key={col} className="px-3.5 py-3 text-left">
										<SortButton
											label={label}
											col={col}
											sortCol={orderBy}
											onSort={handleSort}
										/>
									</th>
								))}

									<th className="px-3.5 py-3">
										<div className="flex items-center justify-between">
											<span
												className="text-xs font-semibold uppercase tracking-wide text-gray-500">
												Action
											</span>
											<Filter size={12} className="text-gray-400" />
										</div>
									</th>
								</tr>
							</thead>

							<tbody>
								{loading ? (
									// eslint-disable-next-line max-len
								Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
							) : customersList.length === 0 ? (
								<tr>
									<td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
										No customers found.
									</td>
								</tr>
							) : (
								customersList.map((c, i) => (
									<tr
										key={c.customer_id + i}
										className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
									>
										{/* Checkbox */}
										<td className="px-3.5 py-3.5">
											<input
												type="checkbox"
												className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
												checked={selected.includes(i)}
												onChange={() => toggleSelect(i)}
											/>
										</td>

										{/* Name Customer */}
										<td className="px-3.5 py-3.5">
											<span
												className="block text-xs font-medium text-blue-600 hover:underline cursor-pointer mb-0.5">
												{c.customer_id}
											</span>
											<span className="text-sm font-medium text-gray-800">{c.name}</span>
										</td>

										{/* Contact */}
										<td className="px-3.5 py-3.5">
											<span className="block text-xs text-gray-600 truncate">{c.email}</span>
											<span className="block text-xs text-gray-400 mt-0.5">{c.phone}</span>
										</td>

										{/* Purchases */}
										<td className="px-3.5 py-3.5 text-sm font-medium text-gray-800">
											{c.purchases}
										</td>

										{/* Order QTY */}
										<td className="px-3.5 py-3.5 text-sm text-gray-600">
											{c.order_qty}
										</td>

										{/* Address */}
										<td className="px-3.5 py-3.5 text-xs text-gray-600 leading-snug">
											{c.address}
										</td>

										{/* Actions */}
										<td className="px-3.5 py-3.5">
											<ActionButtons
												onView={() => {
												}}
												onEdit={() => {
												}}
												onDelete={() => handleDelete(c.customer_id)}
											/>
										</td>
									</tr>
								))
							)}
							</tbody>
						</table>
					</div>

					<Pagination
						page={page}
						totalPages={totalPages}
						total={total}
						onPageChange={setPage}
					/>
				</div>
				<div className="md:hidden bg-white border border-gray-200 rounded-xl overflow-hidden">

					{/* Mobile search */}
					<div className="px-4 pt-3 pb-2">
						<div className="relative flex items-center">
							<Search
								size={14}
								className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
							/>
							<input
								type="text"
								placeholder="Search for id, name Customer"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-sm
                           text-gray-700 bg-white outline-none
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
							/>
							{searchLoading && (
								<div className="absolute right-2.5 top-1/2 -translate-y-1/2">
									<div
										className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
								</div>
							)}
						</div>
					</div>

					{/* Column header row */}
					<div className="flex items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
						<div className="w-8 flex-shrink-0">
							<input
								type="checkbox"
								className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
								checked={allSelected}
								onChange={toggleAll}
							/>
						</div>
						<SortButton
							label="Name Customer"
							col="name"
							sortCol={orderBy}
							onSort={handleSort}
						/>
					</div>

					{/* Customer rows */}
					{loading ? (
						Array.from({ length: 6 }).map((_, i) => <MobileSkeletonRow key={i} />)
					) : customersList.length === 0 ? (
						<div className="py-14 text-center text-gray-400 text-sm">
							No customers found.
						</div>
					) : (
						customersList.map((c, i) => (
							<div key={c.customer_id + i} className="border-b border-gray-100 last:border-0">

								{/* Collapsed header */}
								<div className="flex items-center gap-2 px-4 py-3">
									<input
										type="checkbox"
										className="w-4 h-4 cursor-pointer accent-blue-600 rounded flex-shrink-0"
										checked={selected.includes(i)}
										onChange={() => toggleSelect(i)}
									/>
									<div className="flex-1 min-w-0">
										<span
											className="block text-xs font-medium text-blue-600 hover:underline cursor-pointer mb-0.5">
											{c.customer_id}
										</span>
										<span className="block text-sm font-medium text-gray-800 truncate">
											{c.name}
										</span>
									</div>
									<button
										onClick={() => setExpandedRow(expandedRow === i ? null : i)}
										className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700
                               bg-transparent border-none cursor-pointer"
									>
										{expandedRow === i
											? <ChevronUp size={18} />
											: <ChevronDown size={18} />}
									</button>
								</div>

								{/* Expanded detail panel */}
								{expandedRow === i && (
									<div className="pl-14 pr-4 pb-4 border-t border-gray-50">
										{[
											{ label: "Contact", value: <>{c.email}<br />{c.phone}</> },
											{ label: "Purchases", value: c.purchases },
											{ label: "Order", value: c.order_qty },
											{ label: "Address", value: c.address },
										].map(({ label, value }) => (
											<div key={label} className="flex gap-3 pt-2.5">
												<span className="text-xs font-medium text-gray-400 min-w-[72px]">
													{label}
												</span>
												<span className="text-xs text-gray-600 leading-relaxed flex-1">
													{value}
												</span>
											</div>
										))}

										<div className="flex gap-3 pt-2.5 items-center">
											<span className="text-xs font-medium text-gray-400 min-w-[72px]">
												Action
											</span>
											<ActionButtons
												onView={() => {
												}}
												onEdit={() => {
												}}
												onDelete={() => handleDelete(c.customer_id)}
											/>
										</div>
									</div>
								)}
							</div>
						))
					)}

					<Pagination
						page={page}
						totalPages={totalPages}
						total={total}
						onPageChange={setPage}
					/>
				</div>

				<div className="pb-8" />
			</div>
		</>
	);
}
