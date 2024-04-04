import { onSelectInputChange, onTextInputChange } from "@/utils";
import { useEffect, useState } from "react";

export const useCreateCustomAttributeModal = () => {
	const [customAttributeName, setCustomAttributeName] = useState<string>("");
	const [type, setType] = useState<string>("");

	useEffect(() => {
		console.log("type", type);
	}, [type]);

	return {
		customAttributeName,
		onCustomAttributeNameChange: onTextInputChange(setCustomAttributeName),
		type,
		onTypeChange: onSelectInputChange(setType),
	};
};
