"use client";

import dynamic from "next/dynamic";
import React from "react";
import { ProvinceData } from "@/types/customer_growth";

// Leaflet reads `window` on import — must be client-only
const CustomerGrowthMapInner = dynamic(
	() =>
		import("./customer_growth_map_inner").then(
			(mod) => mod.CustomerGrowthMapInner
		),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
				<span className="text-[12px] text-gray-400">Loading map…</span>
			</div>
		),
	}
);

export interface CustomerGrowthMapProps {
	provinces?: ProvinceData[];
	height?: number; // px, defaults to 200
}

export const CustomerGrowthMap = ({ provinces, height = 200 }: CustomerGrowthMapProps) => (
	<>
		{/* Scoped styles — strip Leaflet tooltip chrome to match design */}
		<style>{`
				.leaflet-province-tooltip {
					background: white;
					border: 1px solid #e5e7eb;
					border-radius: 6px;
					padding: 3px 7px;
					box-shadow: 0 2px 6px rgba(0,0,0,0.08);
					white-space: nowrap;
				}
				.leaflet-province-tooltip::before {
					display: none;
				}
				.leaflet-container {
					font-family: inherit;
				}
			`}
		</style>

		<div style={{ height }} className="w-full rounded-xl overflow-hidden mt-3">
			<CustomerGrowthMapInner provinces={provinces} />
		</div>
	</>
	);

export type { ProvinceData };
