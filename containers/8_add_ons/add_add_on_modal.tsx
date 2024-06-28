"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { upsertAddOnApi } from "@/utils";
import {
	ActionIconComponent,
	ButtonComponent,
	GroupComponent,
	ModalComponent, StackComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { FileInputComponent } from "@/components/mantine/file_input_component";
import ShowNotification from "@/components/mantine/show_notification";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	id: string | undefined;
	initialNameValue: string;
	price: string | undefined;
	icon: string | undefined;
}

const AddAddOnModal: React.FC<Props> = ({
	isOpen,
	onClose,
	setCallApi,
	id,
	initialNameValue,
	price,
	icon }) => {
	const [addOnName, setAddOnName] = useState<string>(initialNameValue);
	const [addOnPrice, setAddOnPrice] = useState<string>(price ?? "");
	const [selectedFileToUpload, setSelectedFileToUpload] = useState<File | null>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const isEditModal: boolean = initialNameValue !== "";

	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (addOnName && icon) {
			setSelectedFile(icon);
		}
	}, [addOnName, icon]);

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

	const handleSubmitAddOn = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!addOnName || !addOnPrice) {
			toast.error("Please provide name and price.");
			return;
		}

		const addOnData = new FormData();
		if (selectedFileToUpload) {
			addOnData.append("icon_file", selectedFileToUpload);
		}
		addOnData.append("name", addOnName);
		addOnData.append("price", addOnPrice);
		addOnData.append("id", id ?? "");
		setLoading(true);
		try {
			await upsertAddOnApi(
				addOnData,
				(response) => {
					onClose();
					setCallApi((val) => !val);
					setLoading(false);
					ShowNotification(response.message, "success");
				},
				(message: string) => {
					ShowNotification(message, "error");
					setLoading(false);
				},
				() => {
				}
			);
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred while saving.");
		}
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800"
			title={
				<TitleComponent
					title={isEditModal ? "Edit Add on" : "New Add on"}
				/>
			}>
			<GroupComponent grow align="start">
				<StackComponent>
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
								className="w-full h-full object-contain"
							/>
						</div>
					) : (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
						<div
							onClick={onChooseIconClick}
							className="w-full cursor-pointer border border-dashed flex flex-col items-center justify-center h-40 rounded-md border-primary-darker text-primary-darker"
						>
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

				<GroupComponent>
					<TextInputComponent
						mt={1}
						required
						label="Name"
						title="Name"
						value={addOnName}
						setValue={setAddOnName}
						placeholder="Awesome Name"
						className="border-grey-600 font-barlow font-base text-base"
						/>

					<TextInputComponent
						mt={1}
						required
						label="Price"
						title="Price"
						type="number"
						value={addOnPrice}
						placeholder="347.1"
						setValue={setAddOnPrice}
						className="border-grey-600 font-barlow font-base text-base"
						/>
				</GroupComponent>
			</GroupComponent>

			<GroupComponent justify="end">
				<ButtonComponent
					loading={loading}
					w={100}
					title="Save"
					onClick={handleSubmitAddOn}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddAddOnModal;
