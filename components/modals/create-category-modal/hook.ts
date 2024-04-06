import { onTextInputChange } from "@/utils";
import { useState } from "react";

export const useCreateCategoryModal = () => {
	const [categoryName, setCategoryName] = useState<string>("");

	return {
		categoryName,
		onCategoryNameChange: onTextInputChange(setCategoryName),
	};
};
