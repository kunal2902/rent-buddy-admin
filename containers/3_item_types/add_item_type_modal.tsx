"use client";

import React, { useRef, useState, useEffect } from "react";
import { Group } from "@mantine/core";
import { Image as ImageIcon, Trash } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { ModalComponent, TextInputComponent, ButtonComponent } from "@/components";
import { FileInputComponent } from "@/components/mantine/file_input_component";
import { useCreateItemTypeModal } from "./hook";
import { imageUrl, upsertItemTypeApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: (value: boolean) => void;
	itemType: string;
	name: string;
	id: string;
	image: string | undefined;
}

const AddItemTypeModal: React.FC<Props> = ({ isOpen, onClose, setCallApi, itemType, image, name, id }) => {
	const { itemTypeName, onItemTypeNameChange, setItemTypeName } = useCreateItemTypeModal(name);
	const [selectedFileToUpload, setSelectedFileToUpload] = useState<File | null>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (image) {
			const imgUrl = `${imageUrl}/${image}`;
			setSelectedFile(imgUrl);
		} else {
			setSelectedFile(null);
		}
	}, [id, name, image]);

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
				if (readerEvent.target && typeof readerEvent.target.result === "string") {
					console.log("File read result:", readerEvent.target.result); // Debugging line
					setSelectedFile(readerEvent.target.result);
				}
			};
		}
	};

	const handleSubmitItemType = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!itemTypeName) {
			toast.error("Please provide a name.");
			return;
		}

		const itemTypeData = new FormData();
		if (selectedFileToUpload) {
			itemTypeData.append("icon_file", selectedFileToUpload);
		}
		itemTypeData.append("name", itemTypeName);
		if (itemType === "Edit") {
			// Edit item type
			itemTypeData.append("id", id);
		}

		try {
			await upsertItemTypeApi(
				itemTypeData,
				() => {
					onClose();
					setCallApi(true);
				},
				(message: string) => {
					toast.error(message);
				},
				() => {}
			);
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred while saving.");
		}
	};

	const handleCloseModal = () => {
		if (itemType !== "Edit") {
			setItemTypeName("");
			setSelectedFile(null);
			setSelectedFileToUpload(null);
			onClose();
		} else {
			onClose();
		}
	};

	return (
		<ModalComponent opened={isOpen} onClose={handleCloseModal} className="border-grey-800" title={`${itemType === "Edit" ? "Edit" : "Add"} Item type`}>
			<div className="w-full flex sm:flex-row flex-col font-public-sans">
				<div className="sm:w-1/2 w-full flex flex-col sm:mr-1">
					<FileInputComponent
						label="Please select sub category icon"
						placeholder="Sub category icon"
						className="hidden"
						onChange={onFilePick}
						ref={fileInputTriggerRef}
					/>

					<p className="text-base font-public-sans">Icon*</p>

					<button className="mt-1 flex items-center justify-center w-full" onClick={onChooseIconClick}>
						{selectedFile ? (
							<div className="w-full flex flex-col items-center justify-center h-40">
								<Image src={selectedFile} width={500} height={500} alt="Selected Icon" className="w-full h-full object-contain" />
							</div>
						) : (
							<div className="w-full border border-dashed flex flex-col items-center justify-center h-40 rounded-md border-primary-darker text-primary-darker">
								<ImageIcon size={50} />
								<p className="text-center mt-0.5">Choose an image</p>
							</div>
						)}
					</button>

					{selectedFile && (
						<div className="w-full mt-1 flex items-center justify-end">
							<button className="flex items-center justify-center" onClick={onResetIconClick} aria-label="on reset icon click">
								<Trash size={24} className="text-error-dark" />
							</button>
						</div>
					)}
				</div>

				<div className="sm:ml-1 sm:mt-0 mt-2 flex-1 flex flex-col">
					<Group>
						<TextInputComponent
							label="Name"
							placeholder="Awesome Name"
							className="border-grey-600 font-barlow font-base text-base"
							required
							value={itemTypeName}
							onChange={(e) => onItemTypeNameChange(e.target.value)}
						/>
					</Group>
				</div>
			</div>

			<div className="mt-3 flex items-center justify-end">
				<ButtonComponent title="Save" size="md" px="lg" ml={5} onClick={handleSubmitItemType} />
			</div>
		</ModalComponent>
	);
};

export default AddItemTypeModal;
