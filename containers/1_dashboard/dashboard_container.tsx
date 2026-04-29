"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock, Package, TrendingDown, TrendingUp } from "lucide-react";
import {
	CartesianGrid,
	Line, LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { twMerge } from "tailwind-merge";
import {
	LoadingOverlayComponent,
	MainComponent,
} from "@/components";
import { CustomerGrowthMap } from "./customer_growth_map";

interface DashboardData {
	salesInProgress: number;
	salesTarget: number;

	// Stat cards
	totalRevenue: number;
	revenueChange: number; // API key: "revenueChange"   (positive = up)

	totalCustomer: number; // API key: "totalCustomer"
	customerChange: number; // API key: "customerChange"

	totalOrder: number; // API key: "totalOrder"
	orderChange: number; // API key: "orderChange"

	totalProduct: number; // API key: "totalProduct"
	productChange: number; // API key: "productChange"

	totalOrderCount: number; // API key: "totalOrderCount"
	orderCountChange: number; // API key: "orderCountChange"

	totalPending: number; // API key: "totalPending"
	pendingChange: number; // API key: "pendingChange"

	// Chart
	salesChart: Array<{
		month: string; // API key: item.month
		avgSaleValue: number; // API key: item.avgSaleValue
		avgItemPersale: number; // API key: item.avgItemPersale
	}>;

	// Province growth
	provinces: Array<{ name: string; percentage: number; color: string; lat: number; lng: number }>;

	// Product table
	popularProducts: Array<{
		id: string; // API key: item.id
		name: string; // API key: item.name
		price: number; // API key: item.price
		sales: number; // API key: item.sales
		status: "Success" | "Pending" | "Failed"; // API key: item.status
	}>;
}

const MOCK_DATA: DashboardData = {
	salesInProgress: 231032444,
	salesTarget: 500000000,

	totalRevenue: 81000,
	revenueChange: 10.6,

	totalCustomer: 5000,
	customerChange: 1.5,

	totalOrder: 12000,
	orderChange: 3.6,

	totalProduct: 5000,
	productChange: -1.5,

	totalOrderCount: 10293,
	orderCountChange: 1.3,

	totalPending: 2040,
	pendingChange: 1.8,

	salesChart: [
		{ month: "Jan", avgSaleValue: 180000000, avgItemPersale: 90000000 },
		{ month: "Feb", avgSaleValue: 160000000, avgItemPersale: 110000000 },
		{ month: "Mar", avgSaleValue: 200000000, avgItemPersale: 95000000 },
		{ month: "Apr", avgSaleValue: 175000000, avgItemPersale: 120000000 },
		{ month: "Jun", avgSaleValue: 220000000, avgItemPersale: 100000000 },
		{ month: "Jul", avgSaleValue: 339091888, avgItemPersale: 211411223 },
		{ month: "Aug", avgSaleValue: 310000000, avgItemPersale: 190000000 },
		{ month: "Sep", avgSaleValue: 330000000, avgItemPersale: 210000000 },
		{ month: "Oct", avgSaleValue: 350000000, avgItemPersale: 220000000 },
		{ month: "Nov", avgSaleValue: 370000000, avgItemPersale: 230000000 },
		{ month: "Des", avgSaleValue: 390000000, avgItemPersale: 250000000 },
	],

	// eslint-disable-next-line no-mixed-spaces-and-tabs
	 provinces: [
	{ name: "East Java", percentage: 50, color: "#84cc16", lat: -7.536, lng: 112.239 },
	{ name: "Kalimantan", percentage: 50, color: "#3b82f6", lat: -1.681, lng: 113.383 },
	{ name: "Bali", percentage: 65, color: "#1e293b", lat: -8.409, lng: 115.189 },
],

	popularProducts: [
		{ id: "021231", name: "Kanky Kitadakate (Green)", price: 20, sales: 3000, status: "Success" },
		{ id: "021231", name: "Kanky Kitadakate (Green)", price: 20, sales: 2311, status: "Success" },
		{ id: "021231", name: "Kanky Kitadakate (Green)", price: 20, sales: 2111, status: "Success" },
		{ id: "021231", name: "Kanky Kitadakate (Green)", price: 20, sales: 1661, status: "Success" },
	],
};

const fmt = (n: number) =>
	n >= 1_000_000
		? `$${(n / 1_000_000).toFixed(1)}M`
		: n >= 1_000
			? `${(n / 1000).toFixed(0)}.000`
			: `${n}`;

const fmtCurrency = (n: number) =>
	n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(0)}M` : `$${(n / 1000).toFixed(0)}K`;

/** Trend badge: green up, red down */
function TrendBadge({ value, suffix = "From last week" }: { value: number; suffix?: string }) {
	const up = value >= 0;
	return (
		<div className={twMerge("flex items-center gap-0.5 text-[11px] font-semibold", up ? "text-green-500" : "text-red-500")}>
			{up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
			<span>{Math.abs(value)}%</span>
			<span className="text-gray-400 font-normal ml-0.5">{suffix}</span>
		</div>
	);
}

/** White stat card — used for Total Customer, Total Order, Total Product */
function StatCard({ title, value, change, suffix, icon, iconBg }: {
	title: string;
	value: string;
	change: number;
	suffix?: string;
	icon?: React.ReactNode;
	iconBg?: string;
}) {
	return (
		<div className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-gray-100">
			<div className="flex items-center justify-between">
				<span className="text-[13px] font-semibold text-gray-700">{title}</span>
				{icon ? (
					<div className={twMerge("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
						{icon}
					</div>
				) : (
					<ArrowUpRight size={16} className="text-gray-400" />
				)}
			</div>
			<div>
				<p className="text-[28px] font-bold text-gray-900 leading-tight">{value}</p>
			</div>
			<TrendBadge value={change} suffix={suffix} />
		</div>
	);
}

/** Custom chart tooltip */
function ChartTooltip({ active, payload, label }: any) {
	if (!active || !payload?.length) return null;
	return (
		<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-[12px]">
			<p className="font-semibold text-gray-700 mb-1">{label}</p>
			{payload.map((p: any) => (
				<div key={p.name} className="flex items-center gap-1.5">
					<span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
					<span className="text-gray-500">{p.name === "avgSaleValue" ? "Avg Sale Value" : "Avg Item Persale"}:</span>
					<span className="font-semibold">{fmtShort(p.value)}</span>
				</div>
			))}
		</div>
	);
}
/** Product Popular table row */
function ProductRow({ product }: { product: DashboardData["popularProducts"][0]; isLast: boolean }) {
	return (
		<>
			{/* Desktop row */}
			<tr className="hidden md:table-row hover:bg-gray-50 transition-colors">
				<td className="py-3 px-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
							<Package size={14} className="text-gray-400" />
						</div>
						<div>
							<p className="text-[11px] text-gray-400">{product.id}</p>
							<p className="text-[13px] font-medium text-gray-800">{product.name}</p>
						</div>
					</div>
				</td>
				<td className="py-3 px-4 text-[13px] text-gray-700">${product.price.toFixed(2)}</td>
				<td className="py-3 px-4 text-[13px] text-gray-700">{product.sales.toLocaleString()}</td>
				<td className="py-3 px-4">
					<span className={twMerge(
						"inline-block px-3 py-1 rounded-full text-[12px] font-semibold",
						product.status === "Success" ? "bg-green-100 text-green-700" :
							product.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
								"bg-red-100 text-red-700"
					)}>
						{product.status}
					</span>
				</td>
			</tr>

			{/* Mobile accordion row */}
			<MobileProductRow product={product} />
		</>
	);
}

function MobileProductRow({ product }: { product: DashboardData["popularProducts"][0] }) {
	const [open, setOpen] = useState(false);
	return (
		<tr className="md:hidden">
			<td colSpan={4} className="py-0">
				<div className="border-b border-gray-50 last:border-0">
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						className="w-full flex items-center justify-between py-3 px-1"
					>
						<div className="flex items-center gap-3">
							<div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
								<Package size={14} className="text-gray-400" />
							</div>
							<div className="text-left">
								<p className="text-[11px] text-gray-400">{product.id}</p>
								<p className="text-[13px] font-medium text-gray-800">{product.name}</p>
							</div>
						</div>
						<span className="text-gray-400 text-lg">{open ? "▲" : "▾"}</span>
					</button>
					{open && (
						<div className="px-4 pb-3 text-[13px] space-y-1.5 text-gray-600">
							<div className="flex justify-between">
								<span className="text-gray-400">Price</span>
								<span className="font-medium">${product.price.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-400">Sales</span>
								<span className="font-medium">{product.sales.toLocaleString()}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-gray-400">Status</span>
								<span className={twMerge(
									"inline-block px-3 py-0.5 rounded-full text-[12px] font-semibold",
									product.status === "Success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
								)}>
									{product.status}
								</span>
							</div>
						</div>
					)}
				</div>
			</td>
		</tr>
	);
}

const DashboardContainer = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState<DashboardData>(MOCK_DATA);

	useEffect(() => {
		const t = setTimeout(() => setLoading(false), 800);
		return () => clearTimeout(t);
	}, []);

	const progressPct = Math.min(100, (data.salesInProgress / data.salesTarget) * 100);

	return (
		<MainComponent>
			{/* ── Page header ─────────────────────────────────────────────────── */}
			<div className="px-4 md:px-6 pt-4 pb-2">
				<h1 className="text-[22px] font-bold text-gray-900">Dashboard</h1>
				<p className="text-[12px] text-gray-400 mt-0.5">Dashboard</p>
			</div>

			{loading ? (
				<LoadingOverlayComponent />
			) : (
				<div className="px-3 md:px-5 pb-6 space-y-4">

					<div className="grid grid-cols-1 md:grid-cols-12 gap-4">

						{/* Sales Target */}
						<div className="md:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
							<p className="text-[14px] font-semibold text-gray-800 mb-4">Sales Target</p>
							<div className="flex justify-between text-[12px] text-gray-500 mb-1">
								<span>In Progress</span>
								<span>Sales Target</span>
							</div>
							<div className="flex justify-between text-[13px] font-semibold text-gray-800 mb-3">
								<span>${data.salesInProgress.toLocaleString()}</span>
								<span>${data.salesTarget.toLocaleString()}</span>
							</div>
							{/* Progress slider */}
							<div className="relative">
								<div className="h-2 bg-blue-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-blue-500 rounded-full transition-all duration-700"
										style={{ width: `${progressPct}%` }}
									/>
								</div>
								<div
									className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md transition-all duration-700"
									style={{ left: `calc(${progressPct}% - 10px)` }}
								/>
							</div>
						</div>

						{/* Total Revenue — blue card */}
						<div className="md:col-span-3 bg-blue-500 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
							<div className="flex items-center justify-between">
								<span className="text-[13px] font-semibold text-white/90">Total Revenue</span>
								<ArrowUpRight size={16} className="text-white/70" />
							</div>
							<div>
								<p className="text-[28px] font-bold text-white leading-tight">
									${(data.totalRevenue / 1000).toFixed(0)}.000
								</p>
								<div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-green-300">
									<TrendingUp size={12} />
									<span>{data.revenueChange}%</span>
									<span className="text-white/60 font-normal">From last week</span>
								</div>
							</div>
						</div>

						{/* Total Customer */}
						<div className="md:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[120px]">
							<div className="flex items-center justify-between">
								<span className="text-[13px] font-semibold text-gray-700">Total Customer</span>
								<ArrowUpRight size={16} className="text-gray-400" />
							</div>
							<div>
								<p className="text-[28px] font-bold text-gray-900 leading-tight">
									{(data.totalCustomer / 1000).toFixed(0)}.000
								</p>
								<TrendBadge value={data.customerChange} />
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-12 gap-4">

						{/* Sales Chart */}
						<div className="md:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between mb-1">
								<p className="text-[14px] font-semibold text-gray-800">Your Sales this year</p>
								<button type="button" className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-800">
									Show All <ArrowUpRight size={13} />
								</button>
							</div>
							{/* Legend */}
							<div className="flex items-center gap-4 mb-3">
								<div className="flex items-center gap-1.5 text-[11px] text-gray-500">
									<span className="w-8 h-0.5 bg-green-400 rounded block" />
									Average Sale Value
								</div>
								<div className="flex items-center gap-1.5 text-[11px] text-gray-500">
									<span className="w-8 border-t-2 border-dashed border-blue-400 block" />
									Average item persale
								</div>
							</div>
							<div className="h-[200px]">
								<ResponsiveContainer width="100%" height="100%">
									{/* eslint-disable-next-line max-len */}
									<LineChart data={data.salesChart} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
										<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
										<XAxis
											dataKey="month"
											tick={{ fontSize: 11, fill: "#9ca3af" }}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											tick={{ fontSize: 10, fill: "#9ca3af" }}
											axisLine={false}
											tickLine={false}
											tickFormatter={(v) => fmtShort(v)}
										/>
										<Tooltip content={<ChartTooltip />} />
										<ReferenceLine
											x="Jul"
											stroke="#3b82f6"
											strokeWidth={1.5}
											strokeDasharray="0"
											label={{
												position: "top",
												fontSize: 10,
												fill: "#3b82f6",
											}}
										/>
										<Line
											type="monotone"
											dataKey="avgSaleValue"
											stroke="#84cc16"
											strokeWidth={2.5}
											dot={false}
											activeDot={{ r: 4, fill: "#84cc16" }}
										/>
										<Line
											type="monotone"
											dataKey="avgItemPersale"
											stroke="#3b82f6"
											strokeWidth={2}
											strokeDasharray="5 4"
											dot={false}
											activeDot={{ r: 4, fill: "#3b82f6" }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* 4 stat cards — 2x2 grid */}
						<div className="md:col-span-7 grid grid-cols-2 gap-4">
							<StatCard
								title="Total Order"
								value={`${(data.totalOrder / 1000).toFixed(0)}.000`}
								change={data.orderChange}
							/>
							<StatCard
								title="Total Product"
								value={`${(data.totalProduct / 1000).toFixed(0)}.000`}
								change={data.productChange}
							/>
							{/* Total Order count with icon */}
							<div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
								<div className="flex items-start justify-between mb-3">
									<span className="text-[13px] font-semibold text-gray-700">Total Order</span>
									<div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
										<Package size={18} className="text-orange-500" />
									</div>
								</div>
								<p className="text-[26px] font-bold text-gray-900 leading-tight mb-2">
									{data.totalOrderCount.toLocaleString()}
								</p>
								<TrendBadge value={data.orderCountChange} suffix="Up from past week" />
							</div>
							{/* Total Pending with icon */}
							<div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
								<div className="flex items-start justify-between mb-3">
									<span className="text-[13px] font-semibold text-gray-700">Total Pending</span>
									<div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
										<Clock size={18} className="text-red-400" />
									</div>
								</div>
								<p className="text-[26px] font-bold text-gray-900 leading-tight mb-2">
									{data.totalPending.toLocaleString()}
								</p>
								<TrendBadge value={data.pendingChange} suffix="Up from yesterday" />
							</div>
						</div>
					</div>

					<div className="md:hidden bg-blue-500 rounded-2xl p-5 text-white">
						<p className="text-[17px] font-bold mb-2">Increase your sales</p>
						<p className="text-[12px] text-white/80 leading-relaxed mb-4">
							{/* eslint-disable-next-line max-len */}
							Discover the Proven Methods to Skyrocket Your Sales! Unleash the Potential of Your Business and Achieve Remarkable Growth. Whether you&apos;re a seasoned entrepreneur or just starting out.
						</p>
						<button
							type="button"
							className="bg-white text-blue-600 text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
						>
							Learn More
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-12 gap-4">

						{/* Customer Growth */}
						<div className="md:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between mb-1">
								<div>
									<p className="text-[14px] font-semibold text-gray-800">Customer Growth</p>
									<p className="text-[12px] text-gray-400">{data.provinces.length} Province</p>
								</div>
								<button type="button" className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-800">
									Show All <ArrowUpRight size={13} />
								</button>
							</div>
							{/* Province legend */}
							<div className="flex items-center flex-wrap gap-3 mt-2 mb-1">
								{data.provinces.map((p) => (
									<div key={p.name} className="flex items-center gap-1.5 text-[11px] text-gray-600">
										<span
											className="w-2.5 h-2.5 rounded-full flex-shrink-0"
											style={{ background: p.color }}
										/>
										{p.name} ({p.percentage}%)
									</div>
								))}
							</div>
							{/* eslint-disable-next-line no-mixed-spaces-and-tabs */}
							      <CustomerGrowthMap provinces={data.provinces} height={200} />
						</div>

						{/* Product Popular */}
						<div className="md:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
							<div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
								<p className="text-[14px] font-semibold text-gray-800">Product Popular</p>
								<button type="button" className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-800">
									Show All <ArrowUpRight size={13} />
								</button>
							</div>
							<table className="w-full">
								{/* Desktop header */}
								<thead className="hidden md:table-header-group">
									<tr className="border-b border-gray-50 bg-gray-50/50">
										{[
										{ label: "Product", sortable: true },
										{ label: "Price", sortable: true },
										{ label: "Sales", sortable: false },
										{ label: "Status", sortable: false },
									].map(({ label, sortable }) => (
										<th
											key={label}
											className="py-3 px-4 text-left text-[12px] font-semibold text-gray-500"
										>
											<span className="flex items-center gap-1">
												{label}
												{sortable && (
												<span className="text-gray-300 text-[10px] leading-none">⇅</span>
													)}
											</span>
										</th>
									))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50">
									{data.popularProducts.map((product, idx) => (
										<ProductRow
											key={idx}
											product={product}
											isLast={idx === data.popularProducts.length - 1}
									/>
								))}
								</tbody>
							</table>
						</div>
					</div>

				</div>
			)}
		</MainComponent>
	);
};
export default DashboardContainer;
