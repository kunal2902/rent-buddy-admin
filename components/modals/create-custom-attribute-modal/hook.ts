import { onTextInputChange } from "@/utils";
import { useState } from "react";

export const useCreateCustomAttributeModal = () => {
	const [customAttributeName, setCustomAttributeName] = useState<string>("");

	return {
		customAttributeName,
		onCustomAttributeNameChange: onTextInputChange(setCustomAttributeName),
	};
};
