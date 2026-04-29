"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { ProvinceData } from "@/types/customer_growth";

// ─── Default dummy provinces (replace / extend from API) ─────────────────────
export const DUMMY_PROVINCES: ProvinceData[] = [
	{ name: "East Java", percentage: 50, color: "#84cc16", lat: -7.536, lng: 112.239 },
	{ name: "Kalimantan", percentage: 50, color: "#3b82f6", lat: -1.681, lng: 113.383 },
	{ name: "Bali", percentage: 65, color: "#1e293b", lat: -8.409, lng: 115.189 },
	{ name: "West Java", percentage: 42, color: "#f59e0b", lat: -6.889, lng: 107.640 },
	{ name: "South Sulawesi", percentage: 38, color: "#8b5cf6", lat: -5.147, lng: 119.432 },
];

// ─── Radius scale: bigger circle = higher percentage ─────────────────────────
function radiusFor(pct: number) {
	return 8 + (pct / 100) * 18; // 8 px min → 26 px max
}

interface CustomerGrowthMapInnerProps {
	provinces?: ProvinceData[];
}

// eslint-disable-next-line max-len
export const CustomerGrowthMapInner = ({ provinces = DUMMY_PROVINCES }: CustomerGrowthMapInnerProps) => {
	// Fix default Leaflet icon paths that break under webpack
	useEffect(() => {
		// Only needed if you later add standard Markers; safe to keep
		// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
		const L = require("leaflet");
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: "/leaflet/marker-icon-2x.png",
			iconUrl: "/leaflet/marker-icon.png",
			shadowUrl: "/leaflet/marker-shadow.png",
		});
	}, []);

	return (
		<MapContainer
			// Centred roughly over Java / Bali with Indonesia in view
			center={[-3.5, 117.5]}
			zoom={4}
			scrollWheelZoom={false}
			dragging
			zoomControl={false}
			attributionControl={false}
			style={{ height: "100%", width: "100%", borderRadius: "12px" }}
		>
			{/* CartoDB Positron — light, label-only tiles, matches the UI palette */}
			<TileLayer
				url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
				attribution='&copy; <a href="https://carto.com/">CARTO</a>'
				subdomains="abcd"
				maxZoom={19}
			/>

			{provinces.map((province) => (
				<CircleMarker
					key={province.name}
					center={[province.lat, province.lng]}
					radius={radiusFor(province.percentage)}
					pathOptions={{
						color: province.color,
						fillColor: province.color,
						fillOpacity: 0.85,
						weight: 2,
					}}
				>
					{/* Always-visible tooltip anchored above the circle */}
					<Tooltip
						permanent
						direction="top"
						offset={[0, -(radiusFor(province.percentage) + 4)]}
						className="leaflet-province-tooltip"
					>
						<span style={{ fontWeight: 600, fontSize: 11, color: province.color }}>
							{province.name}
						</span>
						<span style={{ fontSize: 11, color: "#6b7280", marginLeft: 3 }}>
							{province.percentage}%
						</span>
					</Tooltip>
				</CircleMarker>
			))}
		</MapContainer>
	);
};
