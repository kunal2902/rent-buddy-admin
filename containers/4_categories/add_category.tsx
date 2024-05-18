"use client";

import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCreateCategoryModal } from "./hook";
import { ButtonComponent, FileInputComponent, ModalComponent, TextInputComponent } from "@/components";
import { upsertCategoryApi } from "@/utils";
import Image from "next/image";
import { Image as ImageIcon, Trash } from "lucide-react";
import { Group } from "@mantine/core";

interface Props {
    isOpen: boolean;
    onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

const CreateCategoryModal = (props: Props) => {
	const { isOpen, onClose, setCallApi } = props;
	const { categoryName, onCategoryNameChange } = useCreateCategoryModal();
	const [selectedFileToUpload, setSelectedFileToUpload] = useState<File | null>(null);
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
				if (readerEvent.target && typeof readerEvent.target.result === "string") {
					setSelectedFile(readerEvent.target.result);
				}
			};
		}
};

	const handleSubmitCat = async (event: React.FormEvent) => {
        event.preventDefault();

		if (!categoryName) {
			toast.error("Please provide name and price.");
			return;
		}

		const categoryData = new FormData();
		if (selectedFileToUpload) {
			categoryData.append("icon_file", selectedFileToUpload);
		}
		categoryData.append("name", categoryName);

        try {
            await upsertCategoryApi(
                categoryData,
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
        }
    };

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New Category">
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

					{/* eslint-disable-next-line react/button-has-type */}
					<button className="mt-1 flex items-center justify-center w-full" onClick={onChooseIconClick}>
						{selectedFile ? (
							<div className="w-full flex flex-col items-center justify-center h-40">
								<Image
									className="w-full h-full object-contain"
									src={selectedFile}
									width={500}
									height={500}
									alt=""
								/>
							</div>
						) : (
							<div
								className="w-full border border-dashed flex flex-col items-center justify-center h-40 rounded-md border-primary-darker text-primary-darker">
								<ImageIcon size={50} />
								<p className="text-center mt-0.5">Choose an image</p>
							</div>
						)}
					</button>

					{selectedFile && (
						<div className="w-full mt-1 flex items-center justify-end">
							{/* eslint-disable-next-line react/button-has-type */}
							<button
								className="flex items-center justify-center"
								onClick={onResetIconClick}
								aria-label="on reset icon click">
								<Trash size={24} className="text-error-dark" />
							</button>
						</div>
					)}
				</div>

				<div className="sm:ml-1 sm:mt-0 mt-2 flex-1 flex flex-col">
					<Group>
						<TextInputComponent
							mt={1}
							required
							label="Name"
							title="Name"
							value={categoryName}
							placeholder="Awesome Name"
							onChange={onCategoryNameChange}
							className="border-grey-600 font-barlow font-base text-base"
						/>
					</Group>
				</div>
			</div>

			<div className="mt-3 flex items-center justify-end">
				<ButtonComponent title="Save" size="md" px="lg" ml={5} onClick={handleSubmitCat} />
			</div>
		</ModalComponent>
	);
};

export default CreateCategoryModal;
