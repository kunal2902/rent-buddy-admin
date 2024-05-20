"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Image as ImageIcon, Trash } from "lucide-react";
import Image from "next/image";
import { Group, Select } from "@mantine/core";
import {
	ButtonComponent,
	ModalComponent,
	TextInputComponent,
} from "@/components";
import { FileInputComponent } from "@/components/mantine/file_input_component";
import { getCategoryApi, mantineLargeModalWidth, upsertSubCategoryApi } from "@/utils";
import { useCreateSubCategoryModal } from "./hook";
import { CategoryModel } from "@/models";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

const CreateSubCategoryModal = (props: Props) => {
	const { isOpen, onClose, setCallApi } = props;
	const {
		subCategoryName,
		onSubCategoryNameChange,
		onChooseIconClick,
		fileInputTriggerRef,
		onFilePick,
		selectedFile,
		onResetIconClick,
		selectedFileToUpload,
	} = useCreateSubCategoryModal();
	const [categories, setCategories] = useState<any>([]);

	useEffect(() => {
		getCategoryApi((data: any) => {
			// setCategories(data.categories);
			// eslint-disable-next-line max-len
			const formattedCategories = data.categories.map((category: { category_id: string; name: string; }) => ({
				value: category.category_id,
				label: category.name,
			}));
			setCategories(formattedCategories)
			setCallApi(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		}).then();
	}, []);

	const handleSubmitSubCat = async (event: React.FormEvent) => {
		event.preventDefault();
		const subCatData = new FormData();
		if (selectedFileToUpload) {
			subCatData.append("icon_file", selectedFileToUpload);
		}
		subCatData.append("name", subCategoryName);
		try {
			await upsertSubCategoryApi(
				subCatData,
				() => {
					onClose();
					setCallApi(true);
				},
				(message: string) => {
					toast.error(message);
				},
				() => {},
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
			title="New sub category"
			closeOnEscape
			size={mantineLargeModalWidth}
		>
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

					<button
						className="mt-1 flex items-center justify-center w-full"
						onClick={onChooseIconClick}
					>
						{selectedFile ? (
							<div className="w-full flex flex-col items-center justify-center h-40">
								<Image
									src={selectedFile}
									width={500}
									height={500}
									alt=""
									className="w-full h-full object-contain"
								/>
							</div>
						) : (
							<div className="w-full border border-dashed flex flex-col items-center justify-center h-40 rounded-md border-primary-darker text-primary-darker">
								<ImageIcon size={50} />

								<p className="text-center mt-0.5">
									Choose an image
								</p>
							</div>
						)}
					</button>

					{selectedFile && (
						<div className="w-full mt-1 flex items-center justify-end">
							<button
								className="flex items-center justify-center"
								onClick={onResetIconClick}
								aria-label="on reset icon click"
							>
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
							value={subCategoryName}
							placeholder="Awesome Name"
							onChange={onSubCategoryNameChange}
							className="border-grey-600 font-barlow font-base text-base"
						/>
						<Select
							required
							label="Select category"
							placeholder="Select category"
							data={categories}
							clearable
						/>
					</Group>
				</div>a
			</div>
			<div className="mt-3 flex items-center justify-end">
				<ButtonComponent
					title="Save"
					size="md"
					px="lg"
					ml={5}
					onClick={handleSubmitSubCat}
				/>
			</div>
		</ModalComponent>
	);
};

export default CreateSubCategoryModal;
