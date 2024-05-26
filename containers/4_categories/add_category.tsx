"use client";

import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Stack } from "@mantine/core";
import {
	ActionIconComponent,
	ButtonComponent,
	FileInputComponent,
	GroupComponent,
	ModalComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { imageUrl, upsertCategoryApi } from "@/utils";

interface Props {
    isOpen: boolean;
    onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialCatValue: string;
	catId: string;
	image: string | undefined;
}

const CreateCategoryModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		image,
		initialCatValue,
		catId,
	} = props;
	const [categoryName, setCategoryName] = useState<string>(initialCatValue);
	const [selectedFileToUpload, setSelectedFileToUpload] = useState<File | null>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);
	const [inputError, setInputError] = useState<string | null>(null);
	const isEditModal: boolean = initialCatValue !== "";

	useEffect(() => {
		if (categoryName && image) {
			const imgUrl = `${imageUrl}/${image}`;
			console.log("initialCatValue", categoryName);
			setSelectedFile(imgUrl);
			setInputError(null);
		}
	}, [categoryName, image]);

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
			setInputError("Please enter the name first");
		}

		const categoryData = new FormData();
		if (selectedFileToUpload) {
			categoryData.append("icon_file", selectedFileToUpload);
		}
		categoryData.append("name", categoryName);
		categoryData.append("id", catId);

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
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800"
			title={<TitleComponent title={isEditModal ? "Edit Category" : "New Category"} />}
		>
			<GroupComponent grow align="start">
				<Stack>
					<FileInputComponent
						required
						label="Please select category icon"
						placeholder="C 111ategory icon"
						className="hidden"
						onChange={onFilePick}
						ref={fileInputTriggerRef}
					/>
					{selectedFile ? (
						<div className="w-full flex flex-col items-center justify-center h-40">
							<Image
								src={selectedFile}
								width={500}
								height={500}
								alt="Selected Icon"
								className="w-full h-full object-contain" />
						</div>
					) : (
						<div
							onClick={onChooseIconClick}
							className="w-full cursor-pointer border border-dashed flex flex-col items-center justify-center h-40 rounded-md border-primary-darker text-primary-darker">
							<ImageIcon size={50} />
							<p className="text-center mt-0.5">Choose an Icon</p>
						</div>
					)}

					{selectedFile && (
						<GroupComponent grow>
							<ActionIconComponent
								onClick={onResetIconClick}
								size="md"
								color="red"
							>
								<MdOutlineDeleteForever size={18} />
							</ActionIconComponent>

							<ActionIconComponent
								onClick={onChooseIconClick}
								size="md"
							>
								<MdOutlineEdit size={18} />
							</ActionIconComponent>

						</GroupComponent>
					)}
				</Stack>

				<TextInputComponent
					required
					title="Name"
					label="Category Name"
					value={categoryName}
					error={inputError}
					setValue={setCategoryName}
					placeholder="Enter Category Name"
				/>

			</GroupComponent>

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitCat}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default CreateCategoryModal;
