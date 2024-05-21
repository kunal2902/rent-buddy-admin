import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useItemTypesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateItemTypeModalOpen, setIsCreateItemTypeModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateItemTypeModalOpen,
		toggleCreateItemTypeModalOpen: toggleBooleanState(
			setIsCreateItemTypeModalOpen
		),
	};
};

export const useCreateItemTypeModal = (name?: string) => {
	const [itemTypeName, setItemTypeName] = useState<string>(name ?? "");

	useEffect(() => {
		setItemTypeName(name ?? "");
	}, [name]);

	return {
		itemTypeName,
		onItemTypeNameChange: (value: string) => setItemTypeName(value),
		setItemTypeName,
	};
};
