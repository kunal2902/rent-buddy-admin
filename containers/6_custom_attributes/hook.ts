import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { onSelectInputChange, onTextInputChange, sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useCustomAttributesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [
		isCreateCustomAttributeModalOpen,
		setIsCreateCustomAttributeModalOpen,
	] = useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateCustomAttributeModalOpen,
		toggleCreateCustomAttributeModalOpen: toggleBooleanState(
			setIsCreateCustomAttributeModalOpen
		),
	};
};

export const useCreateCustomAttributeModal = () => {
	const [customAttributeName, setCustomAttributeName] = useState<string>("");
	const [type, setType] = useState<string | null>("");

	useEffect(() => {}, [type]);

	return {
		customAttributeName,
		onCustomAttributeNameChange: onTextInputChange(setCustomAttributeName),
		type,
		onTypeChange: onSelectInputChange(setType),
	};
};
