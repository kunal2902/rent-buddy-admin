"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PiWarehouse, PiWarehouseFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { ProductItem, useProducts } from "@/containers/2_products/useProducts";

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProductsNavSectionProps {
	isOpen: boolean; // sidebar collapsed / expanded
}

// ─── Sub-item row with tree connector lines ───────────────────────────────────
function ProductSubItem({
							product,
							isActive,
						}: {
	product: ProductItem;
	isActive: boolean;
}) {
	return (
		<li className="relative">
			{/* Horizontal tick */}
			<span
				aria-hidden
				className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-gray-200 dark:bg-gray-700"
			/>
			<Link
				href={product.route}
				className={twMerge(
					"block text-[13px] py-[6px] px-2 rounded-md transition-colors duration-150",
					isActive
						? "text-blue-600 font-semibold"
						: "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5"
				)}
			>
				{product.name}
				{product.count != null && (
					<span className="ml-1 text-gray-400 dark:text-gray-500 font-normal">
						({product.count})
					</span>
				)}
			</Link>
		</li>
	);
}

// ─── Skeleton rows shown while loading ───────────────────────────────────────
function ProductSubItemSkeleton() {
	return (
		<li className="relative py-[6px] px-2">
			<span
				aria-hidden
				className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-gray-200 dark:bg-gray-700"
			/>
			<div className="h-3 w-24 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
		</li>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────
export const ProductsNavSection = ({ isOpen }: ProductsNavSectionProps) => {
	const pathname = usePathname();
	const { items, totalCount, loading } = useProducts();
	const [expanded, setExpanded] = useState(false);

	// Auto-expand when a product route is active
	useEffect(() => {
		if (items.some((p) => pathname === p.route || pathname.startsWith(`${p.route}/`))) {
			setExpanded(true);
		}
	}, [pathname, items]);

	const hasActiveChild = items.some(
		(p) => pathname === p.route || pathname.startsWith(`${p.route}/`)
	);

	const HeaderIcon = hasActiveChild || expanded ? PiWarehouseFill : PiWarehouse;

	return (
		<div>
			{/* ── Header row: Link navigates, chevron toggles dropdown ─────── */}
			<div
				className={twMerge(
					"flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 group",
					hasActiveChild || expanded
						? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
						: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100",
					!isOpen && "justify-center"
				)}
			>
				{/* Clicking icon + label navigates to /products */}
				<Link
					href="/products"
					title={!isOpen ? `Product (${totalCount})` : undefined}
					className="flex items-center gap-3 flex-1 min-w-0"
				>
					<HeaderIcon
						size={17}
						className={twMerge(
							"flex-shrink-0 transition-colors",
							hasActiveChild || expanded
								? "text-blue-500"
								: "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
						)}
					/>
					{isOpen && (
						<span className="truncate">
							Product
							{totalCount > 0 && (
								<span className="ml-1 text-gray-400 dark:text-gray-500 font-normal">
									({totalCount})
								</span>
							)}
						</span>
					)}
				</Link>

				{/* Chevron-only button toggles the dropdown */}
				{isOpen && (
					<button
						type="button"
						onClick={() => setExpanded((v) => !v)}
						aria-label={expanded ? "Collapse products" : "Expand products"}
						className="flex-shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
					>
						{expanded ? (
							<ChevronUp size={13} className="text-gray-400 dark:text-gray-500" />
						) : (
							<ChevronDown size={13} className="text-gray-400 dark:text-gray-500" />
						)}
					</button>
				)}
			</div>

			{/* ── Dropdown list ─────────────────────────────────────────────── */}
			{expanded && isOpen && (
				<div className="relative mt-0.5 pb-1">
					{/* Vertical connector line */}
					<span
						aria-hidden
						className="absolute left-[11px] top-0 bottom-2 w-px bg-gray-200 dark:bg-gray-700"
					/>
					<ul className="pl-7 space-y-0.5">
						{loading ? (
							<>
								<ProductSubItemSkeleton />
								<ProductSubItemSkeleton />
								<ProductSubItemSkeleton />
							</>
						) : (
							items.map((product) => (
								<ProductSubItem
									key={product.id}
									product={product}
									isActive={
										pathname === product.route ||
										pathname.startsWith(`${product.route}/`)
									}
								/>
							))
						)}
					</ul>
				</div>
			)}
		</div>
	);
};
