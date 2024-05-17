"use client";

import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { useCreateTagModal } from "./hook";
import {
	ButtonComponent,
	ModalComponent,
	TextInputComponent,
} from "@/components";
import { upsertTagApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialTagValue: string;
	tagId: string;
}

const AddTagModal = (props: Props) => {
	const { isOpen, onClose, setCallApi, initialTagValue, tagId } = props;
	const { tagName, onTagNameChange } = useCreateTagModal(initialTagValue);
	const isEditModal: boolean = initialTagValue !== "";

	const handleSubmitTag = async (event: React.FormEvent) => {
		event.preventDefault();
		const body = {
			name: tagName,
			id: tagId,
		};

		try {
			await upsertTagApi(
				body,
				() => {
					onClose();
					setCallApi(true);
				},
				(message: string) => {
					toast.error(message);
				},
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
			title={isEditModal ? "Edit Tag" : "New Tag"}
		>
			<TextInputComponent
				mt={1}
				required
				title="Name"
				value={tagName}
				placeholder="Awesome Name"
				onChange={onTagNameChange}
				className="border-grey-600 font-barlow font-base text-base"
			/>

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent
					title="Save"
					fullWidth
					px={5}
					onClick={handleSubmitTag}
				/>
			</div>
		</ModalComponent>
	);
};

export default AddTagModal;
