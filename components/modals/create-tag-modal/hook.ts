import { onTextInputChange } from "@/utils";
import { useState } from "react";

export const useCreateTagModal = () => {
	const [tagName, setTagName] = useState<string>("");

	return {
		tagName,
		onTagNameChange: onTextInputChange(setTagName),
	};
};
