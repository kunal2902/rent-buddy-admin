import { onTextInputChange } from "@/utils";
import { useState } from "react";

export const useCreateAddOnModal = () => {
	const [addOnName, setAddOnName] = useState<string>("");
	const [addOnPrice, setAddOnPrice] = useState<string>("");

	return {
		addOnName,
		onAddOnNameChange: onTextInputChange(setAddOnName),
		addOnPrice,
		onAddOnPriceChange: onTextInputChange(setAddOnPrice),
	};
};
