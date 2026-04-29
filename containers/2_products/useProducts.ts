import { useState, useEffect } from "react";

// ─── Shape returned by the API ────────────────────────────────────────────────
export interface ProductItem {
	id: string; // API key: product.id
	name: string; // API key: product.name
	count?: number; // API key: product.count  (optional — hide if 0 / absent)
	route: string; // derived: e.g. `/products/${product.id}`
}

export interface ProductsResult {
	items: ProductItem[];
	totalCount: number; // API key: meta.total  — shown as "Product (N)"
	loading: boolean;
	error: string | null;
}

// ─── Dummy data — delete this block when the real API is wired ────────────────
const DUMMY_PRODUCTS: ProductItem[] = [
	{ id: "air-conditioner", name: "Air Conditioner", count: undefined, route: "/products/air-conditioner" },
	{ id: "refrigerator", name: "Refrigerator", count: undefined, route: "/products/refrigerator" },
	{ id: "microwave", name: "Microwave", count: 121, route: "/products/microwave" },
	{ id: "refrigerator-21", name: "Refrigerator", count: 21, route: "/products/refrigerator-21" },
];
const DUMMY_TOTAL = 119;
// ─────────────────────────────────────────────────────────────────────────────

export const useProducts = (): ProductsResult => {
	const [items, setItems] = useState<ProductItem[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// ─── API INTEGRATION POINT ──────────────────────────────────────────
		// Replace the block below with your real API call, e.g.:
		//
		// getProductsApi(
		//   (result) => {
		//     setItems(
		//       result.data.map((p) => ({
		//         id:    p.id,
		//         name:  p.name,
		//         count: p.count,
		//         route: `/products/${p.id}`,
		//       }))
		//     );
		//     setTotalCount(result.meta.total);
		//     setLoading(false);
		//   },
		//   () => { setError("Failed to load products"); setLoading(false); }
		// );
		// ────────────────────────────────────────────────────────────────────

		// Simulated network delay — remove when using real API
		const t = setTimeout(() => {
			setItems(DUMMY_PRODUCTS);
			setTotalCount(DUMMY_TOTAL);
			setLoading(false);
		}, 600);

		return () => clearTimeout(t);
	}, []);

	return { items, totalCount, loading, error };
};
