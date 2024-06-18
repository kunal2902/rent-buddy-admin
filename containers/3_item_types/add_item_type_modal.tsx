"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
	ActionIconComponent,
	ButtonComponent,
	FileInputComponent,
	GroupComponent,
	ModalComponent,
	StackComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { logoutUser, upsertItemTypeApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialItemTypeValue: string;
	itemTypeId: string;
	icon: string | undefined;
}

const AddItemTypeModal: React.FC<Props> = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		initialItemTypeValue,
		itemTypeId,
		icon,
	} = props;
	const isEditModal: boolean = initialItemTypeValue !== "";
	const [loading, setLoading] = useState(false);
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);
	const [itemTypeName, setItemTypeName] = useState<string>(initialItemTypeValue);
	const [inputError, setInputError] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [selectedFileToUpload, setSelectedFileToUpload] = useState<File | null>(null);

	useEffect(() => {
		if (itemTypeName && icon) {
			setSelectedFile(icon);
			setInputError(null);
		}
	}, [itemTypeName, icon]);

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
			setInputError("Please enter the name first");
		}
		const itemTypeData = new FormData();

		if (selectedFileToUpload) {
			itemTypeData.append("icon_file", selectedFileToUpload);
		}
		itemTypeData.append("name", itemTypeName);
		itemTypeData.append("id", itemTypeId);
		setLoading(true);

		try {
			await upsertItemTypeApi(
				itemTypeData,
				() => {
					onClose();
					setCallApi(val => !val);
					setLoading(false);
				},
				(message: string) => {
					toast.error(message);
					setLoading(false);
				},
				() => {
					setLoading(false);
					logoutUser(useRouter());
				}
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
			title={<TitleComponent title={isEditModal ? "Edit Item Type" : "New Item Type"} />}
		>
			<GroupComponent grow align="start">
				<StackComponent>
					<FileInputComponent
						required
						className="hidden"
						onChange={onFilePick}
						ref={fileInputTriggerRef}
						placeholder="Category icon"
						label="Please select category icon"
					/>
					{selectedFile ? (
						<div className="w-full flex flex-col items-center justify-center h-40">
							<Image
								width={500}
								height={500}
								src={selectedFile}
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
				</StackComponent>

				<TextInputComponent
					required
					title="Name"
					error={inputError}
					value={itemTypeName}
					label="Item Type Name"
					setValue={setItemTypeName}
					placeholder="Enter Item Type Name"
				/>

			</GroupComponent>

			<GroupComponent justify="end">
				<ButtonComponent
					w={100}
					title="Save"
					loading={loading}
					onClick={handleSubmitItemType}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddItemTypeModal;
