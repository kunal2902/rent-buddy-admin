"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { Stack } from "@mantine/core";
import {
	ActionIconComponent,
	ButtonComponent,
	GroupComponent,
	ModalComponent,
	SelectComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { FileInputComponent } from "@/components/mantine/file_input_component";
import { getCategoryApi, imageUrl, upsertSubCategoryApi } from "@/utils";
import { StackComponent } from "@/components/mantine/stack_component";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialSubCategoryValue: string;
	subCategoryId: string;
	initialCategoryIdValue: string;
	icon: string | undefined;
}

const AddSubCategoryModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		initialSubCategoryValue,
		subCategoryId,
		initialCategoryIdValue,
		icon,
	} = props;
	const [subCategoryName, setSubCategoryName] = useState<string>(initialSubCategoryValue);
	const [selectedFileToUpload, setSelectedFileToUpload] = useState<File | null>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);
	const [categories, setCategories] = useState<any>([]);
	const [inputError, setInputError] = useState<string | null>(null);
	const [categoryId, setCategoryId] = useState<string>(initialCategoryIdValue);
	const [loading, setLoading] = useState(false);
	const isEditModal: boolean = initialSubCategoryValue !== "";

	useEffect(() => {
		if (subCategoryName && icon && subCategoryId) {
			const imgUrl = `${imageUrl}/${icon}`;
			setSelectedFile(imgUrl);
			setInputError(null);
		}
	}, [subCategoryName, icon, subCategoryId]);

	useEffect(() => {
		getCategoryApi("",
			(data: any) => {
				const formattedCategories = data.categories.map(
					(category: {
						category_id: string;
						name: string;
					}) => ({
						value: category.category_id,
						label: category.name,
					}));
				setCategories(formattedCategories);
				setCallApi(val => !val);
			},
			() => {
				setCallApi(val => !val);
			},
			() => {
				setCallApi(val => !val);
			}).then();
	}, []);

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

	const handleSubmitSubCat = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!subCategoryName) {
			setInputError("Please enter the name first");
		}

		const subCatData = new FormData();
		if (selectedFileToUpload) {
			subCatData.append("icon_file", selectedFileToUpload);
		}
		subCatData.append("name", subCategoryName);
		subCatData.append("category_id", categoryId);
		subCatData.append("id", subCategoryId);
		setLoading(true);

		try {
			await upsertSubCategoryApi(
				subCatData,
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

				<GroupComponent>
					<TextInputComponent
						mt={1}
						required
						label="Name"
						title="Name"
						value={subCategoryName}
						placeholder="Awesome Name"
						setValue={setSubCategoryName}
						className="border-grey-600 font-barlow font-base text-base"
					/>

					<SelectComponent
						required
						label="Select category"
						placeholder="Select category"
						data={categories}
						clearable={false}
						value={categoryId}
						setValue={setCategoryId}
						checkIconPosition="right"
						isGrouped={false}
					/>
				</GroupComponent>

			</GroupComponent>

			<GroupComponent justify="end">
				<ButtonComponent
					loading={loading}
					w={100}
					title="Save"
					onClick={handleSubmitSubCat}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddSubCategoryModal;
