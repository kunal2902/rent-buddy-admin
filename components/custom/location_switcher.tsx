import { useEffect, useState } from "react";
import { Select } from "@mantine/core";

const LOCATION_KEY = "selected_location";

export const LocationSwitcher = () => {
	const [location, setLocation] = useState<string | null>(
		typeof window !== "undefined" ? localStorage.getItem(LOCATION_KEY) : "Surrey"
	);

	const handleChange = (value: string | null) => {
		if (value) {
			setLocation(value);
			localStorage.setItem(LOCATION_KEY, value);
		}
	};

	useEffect(() => {
		const saved = localStorage.getItem(LOCATION_KEY);
		if (!saved) localStorage.setItem(LOCATION_KEY, "Surrey");
	}, []);

	return (
		<Select
			placeholder="Select location"
			value={location}
			onChange={handleChange}
			data={[
				{ value: "Surrey", label: "Surrey" },
				{ value: "Langley", label: "Langley" },
			]}
			w={180}
			size="sm"
			withCheckIcon={false}

		/>
	);
};
