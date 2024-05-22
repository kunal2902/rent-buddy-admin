import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import {
	sidebarStateAtom,
	toggleBooleanState,
} from "@/utils";

export const useSubCategoriesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateSubCategoryModalOpen, setIsCreateSubCategoryModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateSubCategoryModalOpen,
		toggleCreateSubCategoryModalOpen: toggleBooleanState(
			setIsCreateSubCategoryModalOpen,
		),
	};
};

export const useCreateSubCategoryModal = () => {
	const [selectedFileToUpload, setSelectedFileToUpload] =
		useState<File | null>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);

	const onChooseIconClick = () => {
		if (fileInputTriggerRef) {
			fileInputTriggerRef.current?.click();
		}
	};

	const onResetIconClick = () => {
		setSelectedFile(null);
		setSelectedFileToUpload(null);
	};

	const onFilePick = (file: File | null) => {
		if (file) {
			const fileReader = new FileReader();

			fileReader.readAsDataURL(file);
			setSelectedFileToUpload(file);

			fileReader.onload = (readerEvent) => {
				if (
					readerEvent.target &&
					typeof readerEvent.target.result === "string"
				) setSelectedFile(readerEvent.target.result);
			};
		}
	};

	return {
		onChooseIconClick,
		fileInputTriggerRef,
		selectedFile,
		onFilePick,
		onResetIconClick,
		selectedFileToUpload,
	};
};
